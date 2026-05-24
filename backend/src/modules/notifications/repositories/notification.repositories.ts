import type { Logger } from 'winston';
import PostgresDatabase from '../../../infra/database/postgres';
import { Notification, CreateNotificationDTO } from '../types/notification.types';
import { BadRequestError, NotFoundError } from '../../../shared/errors/appErrors';

export class NotificationRepository {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger
    ) {}

    public async findAll(authId: string, limit: number, offset: number): Promise<{ notifications: Notification[], total: number }> {
        try {
            const sql = `
                SELECT 
                    id, auth_id as "authId", title, body, 
                    is_read as "isRead", data, created_at as "createdAt"
                FROM notifications
                WHERE auth_id = $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
            `;
            const result = await this.db.query(sql, [authId, limit, offset]);

            const countSql = `SELECT COUNT(*) FROM notifications WHERE auth_id = $1`;
            const countResult = await this.db.query(countSql, [authId]);

            return {
                notifications: result.rows,
                total: parseInt(countResult.rows[0].count)
            };
        } catch (error) {
            this.logger.error(`Error fetching notifications for user ${authId}:`, error);
            throw new BadRequestError('Failed to fetch notifications');
        }
    }

    public async create(dto: CreateNotificationDTO): Promise<Notification> {
        try {
            const sql = `
                INSERT INTO notifications (auth_id, title, body, data)
                VALUES ($1, $2, $3, $4)
                RETURNING id, auth_id as "authId", title, body, is_read as "isRead", data, created_at as "createdAt"
            `;
            const result = await this.db.query(sql, [dto.authId, dto.title, dto.body, dto.data || null]);
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error creating notification:', error);
            throw new BadRequestError('Failed to create notification');
        }
    }

    public async markAsRead(id: string): Promise<void> {
        try {
            const sql = `UPDATE notifications SET is_read = TRUE WHERE id = $1`;
            const result = await this.db.query(sql, [id]);
            if (result.rowCount === 0) throw new NotFoundError('Notification not found');
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            this.logger.error(`Error marking notification ${id} as read:`, error);
            throw new BadRequestError('Failed to update notification');
        }
    }

    public async markAllAsRead(authId: string): Promise<void> {
        try {
            const sql = `UPDATE notifications SET is_read = TRUE WHERE auth_id = $1`;
            await this.db.query(sql, [authId]);
        } catch (error) {
            this.logger.error(`Error marking all notifications as read for ${authId}:`, error);
            throw new BadRequestError('Failed to update notifications');
        }
    }
}
