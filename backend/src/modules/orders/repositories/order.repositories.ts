import type { Logger } from 'winston';
import PostgresDatabase from '../../../infra/database/postgres';
import {
    Order,
    OrderItem,
    CreateOrderDTO,
    UpdateOrderStatusDTO,
    OrderStatus,
    DeliveryMode
} from '../types/order.types';
import { BadRequestError, NotFoundError } from '../../../shared/errors/appErrors';

/**
 * Repository gérant toutes les opérations de base de données pour le domaine Orders.
 * La création d'une commande est encapsulée dans une transaction SQL atomique.
 */
export class OrderRepository {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger
    ) {}

    /**
     * Récupère la liste des commandes avec filtres et pagination.
     */
    public async findAll(filters: {
        authId?: string;
        pharmacyId?: string;
        status?: OrderStatus;
        deliveryMode?: DeliveryMode;
        limit: number;
        offset: number;
    }): Promise<{ orders: Order[], total: number }> {
        try {
            let sql = `
                SELECT 
                    o.*,
                    o.auth_id as "authId",
                    o.pharmacy_id as "pharmacyId",
                    o.prescription_id as "prescriptionId",
                    o.delivery_address_id as "deliveryAddressId",
                    o.invoice_number as "invoiceNumber",
                    o.invoice_url as "invoiceUrl",
                    o.delivery_fee as "deliveryFee",
                    o.service_fee as "serviceFee",
                    o.discount_amount as "discountAmount",
                    o.total_amount as "totalAmount",
                    o.delivery_mode as "deliveryMode",
                    o.created_at as "createdAt",
                    o.updated_at as "updatedAt",
                    a.first_name || ' ' || a.last_name as "patientName",
                    p.name as "pharmacyName"
                FROM orders o
                JOIN auth a ON o.auth_id = a.id
                JOIN pharmacy p ON o.pharmacy_id = p.id
                WHERE 1=1
            `;
            const params: any[] = [];
            let paramIdx = 1;

            if (filters.authId) {
                sql += ` AND o.auth_id = $${paramIdx++}`;
                params.push(filters.authId);
            }
            if (filters.pharmacyId) {
                sql += ` AND o.pharmacy_id = $${paramIdx++}`;
                params.push(filters.pharmacyId);
            }
            if (filters.status) {
                sql += ` AND o.status = $${paramIdx++}`;
                params.push(filters.status);
            }
            if (filters.deliveryMode) {
                sql += ` AND o.delivery_mode = $${paramIdx++}`;
                params.push(filters.deliveryMode);
            }

            const countSql = `SELECT COUNT(*) FROM (${sql}) as total`;
            const countResult = await this.db.query(countSql, params);

            sql += ` ORDER BY o.created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
            params.push(filters.limit, filters.offset);

            const result = await this.db.query(sql, params);
            return { orders: result.rows, total: parseInt(countResult.rows[0].count) };
        } catch (error) {
            this.logger.error('Error fetching orders:', error);
            throw new BadRequestError('Failed to fetch orders');
        }
    }

    /**
     * Récupère une commande avec ses lignes (items) et l'historique de statut.
     */
    public async findById(id: string): Promise<Order | null> {
        try {
            const sql = `
                SELECT 
                    o.*,
                    o.auth_id as "authId",
                    o.pharmacy_id as "pharmacyId",
                    o.prescription_id as "prescriptionId",
                    o.delivery_address_id as "deliveryAddressId",
                    o.invoice_number as "invoiceNumber",
                    o.invoice_url as "invoiceUrl",
                    o.delivery_fee as "deliveryFee",
                    o.service_fee as "serviceFee",
                    o.discount_amount as "discountAmount",
                    o.total_amount as "totalAmount",
                    o.delivery_mode as "deliveryMode",
                    o.created_at as "createdAt",
                    o.updated_at as "updatedAt",
                    a.first_name || ' ' || a.last_name as "patientName",
                    p.name as "pharmacyName"
                FROM orders o
                JOIN auth a ON o.auth_id = a.id
                JOIN pharmacy p ON o.pharmacy_id = p.id
                WHERE o.id = $1
            `;
            const result = await this.db.query(sql, [id]);
            if (result.rows.length === 0) return null;

            const order = result.rows[0];

            // Charger les items
            const itemsSql = `
                SELECT 
                    oi.*,
                    oi.order_id as "orderId",
                    oi.medicine_id as "medicineId",
                    m.business_name as "medicineName"
                FROM order_items oi
                JOIN medicine m ON oi.medicine_id = m.id
                WHERE oi.order_id = $1
            `;
            const itemsResult = await this.db.query(itemsSql, [id]);
            order.items = itemsResult.rows;

            // Charger l'historique des statuts
            const historySql = `
                SELECT 
                    id,
                    order_id as "orderId",
                    status,
                    changed_by_auth_id as "changedByAuthId",
                    notes,
                    created_at as "createdAt"
                FROM order_status_history
                WHERE order_id = $1
                ORDER BY created_at ASC
            `;
            const historyResult = await this.db.query(historySql, [id]);
            order.statusHistory = historyResult.rows;

            return order;
        } catch (error) {
            this.logger.error(`Error fetching order ${id}:`, error);
            throw new BadRequestError('Failed to fetch order details');
        }
    }

    /**
     * Crée une commande atomiquement : calcul du total, insertion de la commande,
     * des items et du premier enregistrement dans l'historique des statuts.
     */
    public async create(dto: CreateOrderDTO): Promise<Order> {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');

            // Calculer le sous-total depuis les items
            const subtotal = dto.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const totalAmount = subtotal + (dto.deliveryFee || 0) + (dto.serviceFee || 0) - (dto.discountAmount || 0);

            // 1. Insérer la commande
            const orderSql = `
                INSERT INTO orders (auth_id, pharmacy_id, prescription_id, delivery_address_id, delivery_mode, subtotal, delivery_fee, service_fee, discount_amount, total_amount)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *,
                    auth_id as "authId", pharmacy_id as "pharmacyId",
                    prescription_id as "prescriptionId", delivery_address_id as "deliveryAddressId",
                    delivery_fee as "deliveryFee", service_fee as "serviceFee",
                    discount_amount as "discountAmount", total_amount as "totalAmount",
                    delivery_mode as "deliveryMode",
                    created_at as "createdAt", updated_at as "updatedAt"
            `;
            const orderResult = await client.query(orderSql, [
                dto.authId, dto.pharmacyId, dto.prescriptionId || null,
                dto.deliveryAddressId || null, dto.deliveryMode,
                subtotal, dto.deliveryFee || 0, dto.serviceFee || 0, dto.discountAmount || 0, totalAmount
            ]);
            const newOrder = orderResult.rows[0];

            // 2. Insérer les items de la commande
            const itemSql = `
                INSERT INTO order_items (order_id, medicine_id, quantity, price)
                VALUES ($1, $2, $3, $4)
            `;
            newOrder.items = [];
            for (const item of dto.items) {
                await client.query(itemSql, [newOrder.id, item.medicineId, item.quantity, item.price]);
                newOrder.items.push(item);
            }

            // 3. Créer le premier historique de statut (pending)
            const historySql = `
                INSERT INTO order_status_history (order_id, status, notes)
                VALUES ($1, $2, $3)
            `;
            await client.query(historySql, [newOrder.id, OrderStatus.PENDING, 'Commande créée']);

            await client.query('COMMIT');
            return newOrder;
        } catch (error) {
            await client.query('ROLLBACK');
            this.logger.error('Error creating order:', error);
            throw new BadRequestError('Failed to create order');
        } finally {
            client.release();
        }
    }

    /**
     * Met à jour le statut d'une commande et l'enregistre dans l'historique.
     */
    public async updateStatus(id: string, dto: UpdateOrderStatusDTO): Promise<Order> {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');

            const updateSql = `
                UPDATE orders SET status = $2, updated_at = NOW() WHERE id = $1
            `;
            const result = await client.query(updateSql, [id, dto.status]);
            if (result.rowCount === 0) throw new NotFoundError('Order not found');

            // Enregistrer le changement dans l'historique
            const historySql = `
                INSERT INTO order_status_history (order_id, status, changed_by_auth_id, notes)
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(historySql, [
                id, dto.status, dto.changedByAuthId || null, dto.notes || null
            ]);

            await client.query('COMMIT');
            return (await this.findById(id))!;
        } catch (error) {
            await client.query('ROLLBACK');
            if (error instanceof NotFoundError) throw error;
            this.logger.error(`Error updating order status ${id}:`, error);
            throw new BadRequestError('Failed to update order status');
        } finally {
            client.release();
        }
    }

    /**
     * Annule une commande (soft-cancel via le statut).
     */
    public async cancel(id: string, reason?: string): Promise<Order> {
        return this.updateStatus(id, {
            status: OrderStatus.CANCELLED,
            notes: reason || 'Commande annulée'
        });
    }
}
