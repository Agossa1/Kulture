import { Router } from 'express';
import PostgresDatabase from '../../../infra/database/postgres';
import { logger } from '../../../shared/loggers/logger';
import { SearchModule } from '../search.module';

/**
 * Configure les routes pour le module Search.
 * @param db Instance de la base de données
 */
export const configureSearchRoutes = (db: PostgresDatabase) => {
    const router = Router();
    const searchModule = new SearchModule(db, logger);

    // Endpoint principal de recherche de disponibilité d'un médicament
    router.get('/availability', searchModule.availabilityController.search);

    // Endpoints pour chercher les pharmacies
    router.get('/pharmacies/all', searchModule.searchAllController.searchAll);
    router.get('/pharmacies/on-duty', searchModule.searchOnDutyController.searchOnDuty);

    return router;
};
