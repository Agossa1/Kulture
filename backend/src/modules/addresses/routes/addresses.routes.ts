import { Router } from 'express';
import PostgresDatabase from '../../../infra/database/postgres';
import { logger } from '../../../shared/loggers/logger';
import { AddressesModule } from '../addresses.module';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';

export const configureAddressesRoutes = (db: PostgresDatabase) => {
    const router = Router();
    const addressesModule = new AddressesModule(db, logger);

    // Routes
    router.post('/', authMiddleware, addressesModule.createController.create);
    router.get('/', authMiddleware, addressesModule.listController.list);
    router.get('/:id', authMiddleware, addressesModule.getController.get);
    router.put('/:id', authMiddleware, addressesModule.updateController.update);
    router.delete('/:id', authMiddleware, addressesModule.deleteController.delete);

    return router;
};
