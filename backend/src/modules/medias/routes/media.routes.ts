import { Router } from 'express';
import PostgresDatabase from '../../../infra/database/postgres';
import { logger } from '../../../shared/loggers/logger';
import { StockModule } from '../stock.module';

import { authMiddleware, roleMiddleware } from '../../../shared/middlewares/auth.middleware';

/**
 * Configure les routes pour le module Stocks.
 * @param db Instance de la base de données
 */
export const configureStockRoutes = (db: PostgresDatabase) => {
    const router = Router();
    const stockModule = new StockModule(db, logger);

    // Toutes les routes de stock sont protégées (Pharmacien / Admin)
    router.use(authMiddleware);
    router.use(roleMiddleware(['pharmacist', 'admin', 'super_admin']));

    router.get('/', stockModule.getAllController.getAll);
    router.get('/:id', stockModule.getByIdController.getById);
    router.post('/', stockModule.createController.create);
    router.patch('/:id', stockModule.updateController.update);
    router.delete('/:id', stockModule.deleteController.delete);

    return router;
};
