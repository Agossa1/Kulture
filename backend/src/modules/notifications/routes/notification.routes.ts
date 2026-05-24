import { Router } from 'express';
import PostgresDatabase from '../../../infra/database/postgres';
import { logger } from '../../../shared/loggers/logger';
import { NotificationModule } from '../notification.module';

import { authMiddleware } from '../../../shared/middlewares/auth.middleware';

/**
 * Configure les routes pour le module Notifications.
 * @param db Instance de la base de données
 */
export const configureNotificationRoutes = (db: PostgresDatabase) => {
    const router = Router();
    const notificationModule = new NotificationModule(db, logger);

    // Authentification obligatoire
    router.use(authMiddleware);

    // Récupérer les notifications d'un utilisateur
    router.get('/:authId', notificationModule.getNotificationsController.getNotifications);
    
    // Marquer une notification comme lue
    router.patch('/:id/read', notificationModule.markAsReadController.markAsRead);
    
    // Tout marquer comme lu
    router.patch('/all/:authId/read', notificationModule.markAsReadController.markAllAsRead);

    return router;
};
