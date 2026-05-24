import PostgresDatabase from '../../infra/database/postgres';
import type { Logger } from 'winston';
import { NotificationRepository } from './repositories/notification.repositories';

import { GetNotificationsService } from './services/get-notifications.service';
import { MarkAsReadService } from './services/mark-as-read.service';
import { CreateNotificationService } from './services/create-notification.service';

import { GetNotificationsController } from './controllers/get-notifications.controller';
import { MarkAsReadController } from './controllers/mark-as-read.controller';

/**
 * Module Notifications.
 * Gère le stockage et la lecture des notifications in-app.
 */
export class NotificationModule {
    public readonly getNotificationsController: GetNotificationsController;
    public readonly markAsReadController: MarkAsReadController;
    public readonly createNotificationService: CreateNotificationService;

    constructor(db: PostgresDatabase, logger: Logger) {
        // 1. Repository
        const notificationRepository = new NotificationRepository(db, logger);

        // 2. Services
        const getNotificationsService = new GetNotificationsService(notificationRepository, logger);
        const markAsReadService = new MarkAsReadService(notificationRepository, logger);
        this.createNotificationService = new CreateNotificationService(notificationRepository, logger);

        // 3. Contrôleurs
        this.getNotificationsController = new GetNotificationsController(getNotificationsService);
        this.markAsReadController = new MarkAsReadController(markAsReadService);
    }
}
