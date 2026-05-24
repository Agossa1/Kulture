import { NotificationRepository } from "../repositories/notification.repositories";
import type { Logger } from 'winston';

export class MarkAsReadService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly logger: Logger
    ) {}

    public async markAsRead(id: string): Promise<void> {
        try {
            await this.notificationRepository.markAsRead(id);
        } catch (error) {
            this.logger.error(`Error in MarkAsReadService for ${id}:`, error);
            throw error;
        }
    }

    public async markAllAsRead(authId: string): Promise<void> {
        try {
            await this.notificationRepository.markAllAsRead(authId);
        } catch (error) {
            this.logger.error(`Error in MarkAsReadService (all) for ${authId}:`, error);
            throw error;
        }
    }
}
