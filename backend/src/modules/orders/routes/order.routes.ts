import { Router } from 'express';
import PostgresDatabase from '../../../infra/database/postgres';
import { logger } from '../../../shared/loggers/logger';
import { OrderModule } from '../order.module';

import { authMiddleware, roleMiddleware } from '../../../shared/middlewares/auth.middleware';

/**
 * Configure les routes pour le module Orders.
 * @param db Instance de la base de données
 */
export const configureOrderRoutes = (db: PostgresDatabase) => {
    const router = Router();
    const orderModule = new OrderModule(db, logger);

    // Authentification obligatoire pour toutes les commandes
    router.use(authMiddleware);

    router.get('/', orderModule.getAllController.getAll);
    router.get('/:id', orderModule.getByIdController.getById);
    router.post('/', orderModule.createController.create);
    
    // Mise à jour de statut (Pharmacien / Admin uniquement)
    router.patch('/:id/status', roleMiddleware(['pharmacist', 'admin', 'super_admin']), orderModule.updateStatusController.updateStatus);
    
    // Annulation (Client, Pharmacien ou Admin)
    router.patch('/:id/cancel', orderModule.cancelController.cancel);

    return router;
};
