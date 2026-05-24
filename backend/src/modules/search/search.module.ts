import PostgresDatabase from '../../infra/database/postgres';
import type { Logger } from 'winston';
import { SearchRepository } from './repositories/search.repositories';
import { SearchAvailabilityService } from './services/search-availability.service';
import { SearchAllPharmaciesService } from './services/search-all-pharmacies.service';
import { SearchOnDutyPharmaciesService } from './services/search-on-duty-pharmacies.service';
import { SearchAvailabilityController } from './controllers/search-availability.controller';
import { SearchAllPharmaciesController } from './controllers/search-all-pharmacies.controller';
import { SearchOnDutyPharmaciesController } from './controllers/search-on-duty-pharmacies.controller';

/**
 * Module Search.
 * Centralise l'injection de dépendances pour les fonctionnalités de recherche géospatiales.
 */
export class SearchModule {
    public readonly availabilityController: SearchAvailabilityController;
    public readonly searchAllController: SearchAllPharmaciesController;
    public readonly searchOnDutyController: SearchOnDutyPharmaciesController;

    constructor(db: PostgresDatabase, logger: Logger) {
        // 1. Repository
        const searchRepository = new SearchRepository(db, logger);

        // 2. Services
        const searchAvailabilityService = new SearchAvailabilityService(searchRepository, logger);
        const searchAllPharmaciesService = new SearchAllPharmaciesService(searchRepository, logger);
        const searchOnDutyPharmaciesService = new SearchOnDutyPharmaciesService(searchRepository, logger);

        // 3. Contrôleurs
        this.availabilityController = new SearchAvailabilityController(searchAvailabilityService);
        this.searchAllController = new SearchAllPharmaciesController(searchAllPharmaciesService);
        this.searchOnDutyController = new SearchOnDutyPharmaciesController(searchOnDutyPharmaciesService);
    }
}


