import { NotificationRepository } from "../repositories/notification.repositories";
import type { Logger } from 'winston';
import { Notification, CreateNotificationDTO } from "../types/notification.types";

export class CreateNotificationService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly logger: Logger
    ) {}

    public async create(dto: CreateNotificationDTO): Promise<Notification> {
        try {
            const notification = await this.notificationRepository.create(dto);
            this.logger.info(`Notification créée pour l'utilisateur ${dto.authId}`);
            return notification;
        } catch (error) {
            this.logger.error('Error in CreateNotificationService:', error);
            throw error;
        }
    }
}
