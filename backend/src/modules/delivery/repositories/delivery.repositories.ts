import type { Logger } from 'winston';
import PostgresDatabase from '../../../infra/database/postgres';
import { 
    Delivery, 
    DeliveryStatus, 
    AssignDeliveryDTO, 
    UpdateDeliveryStatusDTO,
    UpdatePositionDTO
} from '../types/delivery.types';
import { BadRequestError, NotFoundError } from '../../../shared/errors/appErrors';

/**
 * Repository pour le module Livraison (Delivery).
 * Gère le suivi des livraisons et la position des livreurs via PostGIS.
 */
export class DeliveryRepository {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger
    ) {}

    /**
     * Liste toutes les livraisons avec filtres et pagination.
     */
    public async findAll(filters: {
        status?: DeliveryStatus;
        deliveryPersonId?: string;
        limit: number;
        offset: number;
    }): Promise<{ deliveries: Delivery[], total: number }> {
        try {
            let sql = `
                SELECT 
                    d.*,
                    d.order_id as "orderId",
                    d.delivery_person_id as "deliveryPersonId",
                    d.estimated_delivery_time as "estimatedDeliveryTime",
                    d.actual_delivery_time as "actualDeliveryTime",
                    d.created_at as "createdAt",
                    d.updated_at as "updatedAt",
                    o.invoice_number as "orderNumber",
                    a.first_name || ' ' || a.last_name as "deliveryPersonName"
                FROM delivery d
                JOIN orders o ON d.order_id = o.id
                LEFT JOIN delivery_person dp ON d.delivery_person_id = dp.id
                LEFT JOIN auth a ON dp.auth_id = a.id
                WHERE 1=1
            `;
            const params: any[] = [];
            let paramIdx = 1;

            if (filters.status) {
                sql += ` AND d.status = $${paramIdx++}`;
                params.push(filters.status);
            }
            if (filters.deliveryPersonId) {
                sql += ` AND d.delivery_person_id = $${paramIdx++}`;
                params.push(filters.deliveryPersonId);
            }

            const countSql = `SELECT COUNT(*) FROM (${sql}) as total`;
            const countResult = await this.db.query(countSql, params);

            sql += ` ORDER BY d.created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
            params.push(filters.limit, filters.offset);

            const result = await this.db.query(sql, params);
            return { deliveries: result.rows, total: parseInt(countResult.rows[0].count) };
        } catch (error) {
            this.logger.error('Error fetching deliveries:', error);
            throw new BadRequestError('Failed to fetch deliveries');
        }
    }

    /**
     * Récupère une livraison par ID.
     */
    public async findById(id: string): Promise<Delivery | null> {
        try {
            const sql = `
                SELECT 
                    d.*,
                    d.order_id as "orderId",
                    d.delivery_person_id as "deliveryPersonId",
                    d.estimated_delivery_time as "estimatedDeliveryTime",
                    d.actual_delivery_time as "actualDeliveryTime",
                    d.created_at as "createdAt",
                    d.updated_at as "updatedAt",
                    o.invoice_number as "orderNumber",
                    a.first_name || ' ' || a.last_name as "deliveryPersonName"
                FROM delivery d
                JOIN orders o ON d.order_id = o.id
                LEFT JOIN delivery_person dp ON d.delivery_person_id = dp.id
                LEFT JOIN auth a ON dp.auth_id = a.id
                WHERE d.id = $1
            `;
            const result = await this.db.query(sql, [id]);
            return result.rows[0] || null;
        } catch (error) {
            this.logger.error(`Error fetching delivery ${id}:`, error);
            throw new BadRequestError('Failed to fetch delivery details');
        }
    }

    /**
     * Assigne un livreur à une livraison et crée un enregistrement d'assignation.
     */
    public async assignDelivery(dto: AssignDeliveryDTO): Promise<Delivery> {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');

            const updateSql = `
                UPDATE delivery 
                SET delivery_person_id = $1, status = $2, updated_at = NOW() 
                WHERE id = $3
            `;
            await client.query(updateSql, [dto.deliveryPersonId, DeliveryStatus.ASSIGNED, dto.deliveryId]);

            const assignSql = `
                INSERT INTO delivery_assignment (delivery_id, delivery_person_id)
                VALUES ($1, $2)
            `;
            await client.query(assignSql, [dto.deliveryId, dto.deliveryPersonId]);

            await client.query('COMMIT');
            return (await this.findById(dto.deliveryId))!;
        } catch (error) {
            await client.query('ROLLBACK');
            this.logger.error('Error assigning delivery:', error);
            throw new BadRequestError('Failed to assign delivery');
        } finally {
            client.release();
        }
    }

    /**
     * Met à jour le statut d'une livraison.
     */
    public async updateStatus(id: string, dto: UpdateDeliveryStatusDTO): Promise<Delivery> {
        try {
            let sql = `UPDATE delivery SET status = $1, updated_at = NOW()`;
            const params: any[] = [dto.status, id];
            let paramIdx = 3;

            if (dto.status === DeliveryStatus.DELIVERED) {
                sql += `, actual_delivery_time = NOW()`;
            }

            if (dto.estimatedDeliveryTime) {
                sql += `, estimated_delivery_time = $${paramIdx++}`;
                params.push(dto.estimatedDeliveryTime);
            }

            sql += ` WHERE id = $2`;

            const result = await this.db.query(sql, params);
            if (result.rowCount === 0) throw new NotFoundError('Delivery not found');

            return (await this.findById(id))!;
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            this.logger.error(`Error updating delivery status ${id}:`, error);
            throw new BadRequestError('Failed to update delivery status');
        }
    }

    /**
     * Enregistre la position GPS actuelle d'un livreur.
     */
    public async updatePosition(dto: UpdatePositionDTO): Promise<void> {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Mettre à jour la position actuelle du livreur
            const updatePersonSql = `
                UPDATE delivery_person 
                SET current_location = ST_SetSRID(ST_Point($1, $2), 4326), updated_at = NOW()
                WHERE id = $3
            `;
            await client.query(updatePersonSql, [dto.lng, dto.lat, dto.deliveryPersonId]);

            // 2. Enregistrer dans l'historique des positions
            const historySql = `
                INSERT INTO delivery_position (delivery_person_id, location)
                VALUES ($1, ST_SetSRID(ST_Point($2, $3), 4326))
            `;
            await client.query(historySql, [dto.deliveryPersonId, dto.lng, dto.lat]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            this.logger.error('Error updating delivery person position:', error);
            throw new BadRequestError('Failed to update position');
        } finally {
            client.release();
        }
    }
}
