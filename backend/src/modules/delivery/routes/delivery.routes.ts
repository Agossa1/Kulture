import { Router } from 'express';
import PostgresDatabase from '../../../infra/database/postgres';
import { logger } from '../../../shared/loggers/logger';
import { DeliveryModule } from '../delivery.module';

import { authMiddleware, roleMiddleware } from '../../../shared/middlewares/auth.middleware';

/**
 * Configure les routes pour le module Delivery.
 * @param db Instance de la base de données
 */
export const configureDeliveryRoutes = (db: PostgresDatabase) => {
    const router = Router();
    const deliveryModule = new DeliveryModule(db, logger);

    // Authentification obligatoire
    router.use(authMiddleware);

    // Liste et détails (Admin / Pharmacien / Livreur)
    router.get('/', roleMiddleware(['pharmacist', 'admin', 'delivery_person']), deliveryModule.getAllController.getAll);
    router.get('/:id', roleMiddleware(['pharmacist', 'admin', 'delivery_person']), deliveryModule.getByIdController.getById);

    // Assignation (Admin / Pharmacien uniquement)
    router.post('/assign', roleMiddleware(['pharmacist', 'admin']), deliveryModule.assignController.assign);
    
    // Actions livreurs (Livreur uniquement ou Admin)
    router.patch('/:id/status', roleMiddleware(['delivery_person', 'admin']), deliveryModule.updateStatusController.updateStatus);
    router.post('/position', roleMiddleware(['delivery_person', 'admin']), deliveryModule.updatePositionController.updatePosition);

    return router;
};
