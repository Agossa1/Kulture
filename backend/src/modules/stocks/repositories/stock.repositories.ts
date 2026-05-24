import type { Logger } from 'winston';
import PostgresDatabase from '../../../infra/database/postgres';
import { 
    Stock, 
    CreateStockDTO, 
    UpdateStockDTO,
    AlertType,
    StockMovementType
} from '../types/stock.types';
import { BadRequestError, NotFoundError } from '../../../shared/errors/appErrors';

/**
 * Repository gérant les opérations de base de données pour le domaine Stock.
 */
export class StockRepository {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger
    ) {}

    /**
     * Récupère la liste des stocks avec filtres et pagination.
     */
    public async findAll(filters: {
        pharmacyId?: string;
        medicineId?: string;
        alertLevel?: AlertType;
        search?: string;
        limit: number;
        offset: number;
    }): Promise<{ stocks: Stock[], total: number }> {
        try {
            let sql = `
                SELECT 
                    s.*, 
                    s.pharmacy_id as "pharmacyId",
                    s.medicine_id as "medicineId",
                    s.batch_number as "batchNumber",
                    s.expiration_date as "expirationDate",
                    s.alert_level as "alertLevel",
                    s.created_at as "createdAt", 
                    s.updated_at as "updatedAt",
                    m.business_name as "medicineName",
                    p.name as "pharmacyName"
                FROM stock s
                JOIN medicine m ON s.medicine_id = m.id
                JOIN pharmacy p ON s.pharmacy_id = p.id
                WHERE 1=1
            `;
            const params: any[] = [];
            let paramIdx = 1;

            if (filters.pharmacyId) {
                sql += ` AND s.pharmacy_id = $${paramIdx++}`;
                params.push(filters.pharmacyId);
            }

            if (filters.medicineId) {
                sql += ` AND s.medicine_id = $${paramIdx++}`;
                params.push(filters.medicineId);
            }

            if (filters.alertLevel) {
                sql += ` AND s.alert_level = $${paramIdx++}`;
                params.push(filters.alertLevel);
            }

            if (filters.search) {
                sql += ` AND (m.business_name ILIKE $${paramIdx} OR s.batch_number ILIKE $${paramIdx})`;
                params.push(`%${filters.search}%`);
                paramIdx++;
            }

            const countSql = `SELECT COUNT(*) FROM (${sql}) as total`;
            const countResult = await this.db.query(countSql, params);

            sql += ` ORDER BY s.expiration_date ASC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
            params.push(filters.limit);
            params.push(filters.offset);

            const result = await this.db.query(sql, params);

            return {
                stocks: result.rows,
                total: parseInt(countResult.rows[0].count)
            };
        } catch (error) {
            this.logger.error('Error fetching stocks:', error);
            throw new BadRequestError('Failed to fetch stocks');
        }
    }

    /**
     * Récupère un stock spécifique par ID.
     */
    public async findById(id: string): Promise<Stock | null> {
        try {
            const sql = `
                SELECT 
                    s.*, 
                    s.pharmacy_id as "pharmacyId",
                    s.medicine_id as "medicineId",
                    s.batch_number as "batchNumber",
                    s.expiration_date as "expirationDate",
                    s.alert_level as "alertLevel",
                    s.created_at as "createdAt", 
                    s.updated_at as "updatedAt",
                    m.business_name as "medicineName",
                    p.name as "pharmacyName"
                FROM stock s
                JOIN medicine m ON s.medicine_id = m.id
                JOIN pharmacy p ON s.pharmacy_id = p.id
                WHERE s.id = $1
            `;
            const result = await this.db.query(sql, [id]);
            return result.rows.length ? result.rows[0] : null;
        } catch (error) {
            this.logger.error(`Error fetching stock with id ${id}:`, error);
            throw new BadRequestError('Failed to fetch stock details');
        }
    }

    /**
     * Crée une nouvelle entrée de stock et trace le mouvement initial.
     * Utilise une transaction.
     */
    public async create(dto: CreateStockDTO): Promise<Stock> {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Créer le stock
            const stockSql = `
                INSERT INTO stock (pharmacy_id, medicine_id, batch_number, quantity, price, expiration_date)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *, pharmacy_id as "pharmacyId", medicine_id as "medicineId", batch_number as "batchNumber", expiration_date as "expirationDate", alert_level as "alertLevel"
            `;
            const stockResult = await client.query(stockSql, [
                dto.pharmacyId, dto.medicineId, dto.batchNumber, dto.quantity, dto.price, dto.expirationDate
            ]);
            const newStock = stockResult.rows[0];

            // 2. Tracer le mouvement (IN)
            const movementSql = `
                INSERT INTO stock_movement (stock_id, movement_type, quantity_change, reason)
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(movementSql, [
                newStock.id, StockMovementType.IN, dto.quantity, 'Stock initial'
            ]);

            await client.query('COMMIT');
            return newStock;
        } catch (error: any) {
            await client.query('ROLLBACK');
            this.logger.error('Error creating stock:', error);
            if (error.code === '23505') { // Unique constraint violation (pharmacy, medicine, batch)
                throw new BadRequestError('Ce lot existe déjà pour ce médicament dans cette pharmacie');
            }
            throw new BadRequestError('Failed to create stock');
        } finally {
            client.release();
        }
    }

    /**
     * Met à jour un stock et trace le mouvement (différence de quantité).
     */
    public async update(id: string, dto: UpdateStockDTO): Promise<Stock> {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');

            // Récupérer la quantité actuelle pour calculer la différence
            const currentResult = await client.query('SELECT quantity FROM stock WHERE id = $1', [id]);
            if (currentResult.rows.length === 0) {
                throw new NotFoundError('Stock not found');
            }
            const currentQuantity = currentResult.rows[0].quantity;

            // Mettre à jour la table stock
            const fields = Object.keys(dto).filter(k => (dto as any)[k] !== undefined && k !== 'movementReason');
            
            if (fields.length > 0) {
                const setClause = fields.map((f, i) => {
                    const column = f.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                    return `${column} = $${i + 2}`;
                }).join(', ');

                const updateSql = `
                    UPDATE stock 
                    SET ${setClause}, updated_at = NOW() 
                    WHERE id = $1 
                `;
                const params = [id, ...fields.map(f => (dto as any)[f])];
                await client.query(updateSql, params);
            }

            // Si la quantité a changé, tracer le mouvement
            if (dto.quantity !== undefined && dto.quantity !== currentQuantity) {
                const diff = dto.quantity - currentQuantity;
                const movementType = diff > 0 ? StockMovementType.IN : StockMovementType.OUT;
                
                const movementSql = `
                    INSERT INTO stock_movement (stock_id, movement_type, quantity_change, reason)
                    VALUES ($1, $2, $3, $4)
                `;
                await client.query(movementSql, [
                    id, movementType, diff, dto.movementReason || 'Ajustement manuel'
                ]);
            }

            await client.query('COMMIT');
            
            // Retourner les données fraîches
            const updated = await this.findById(id);
            return updated!;
        } catch (error) {
            await client.query('ROLLBACK');
            if (error instanceof NotFoundError) throw error;
            this.logger.error(`Error updating stock ${id}:`, error);
            throw new BadRequestError('Failed to update stock');
        } finally {
            client.release();
        }
    }

    /**
     * Supprime une entrée de stock (entraîne la suppression en cascade des mouvements et alertes).
     */
    public async delete(id: string): Promise<void> {
        try {
            const sql = `DELETE FROM stock WHERE id = $1`;
            const result = await this.db.query(sql, [id]);
            if (result.rowCount === 0) throw new NotFoundError('Stock not found');
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            this.logger.error(`Error deleting stock ${id}:`, error);
            throw new BadRequestError('Failed to delete stock');
        }
    }
}
