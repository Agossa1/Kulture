import { NotificationRepository } from "../repositories/notification.repositories";
import type { Logger } from 'winston';
import { Notification } from "../types/notification.types";

export class GetNotificationsService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly logger: Logger
    ) {}

    public async getNotifications(authId: string, page: number = 1, limit: number = 20): Promise<{ notifications: Notification[], total: number }> {
        try {
            const offset = (page - 1) * limit;
            return await this.notificationRepository.findAll(authId, limit, offset);
        } catch (error) {
            this.logger.error(`Error in GetNotificationsService for ${authId}:`, error);
            throw error;
        }
    }
}
