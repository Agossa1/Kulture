import { SearchRepository } from "../repositories/search.repositories";
import type { Logger } from 'winston';
import { PharmacyCityResult } from "../types/search.types";

export class SearchOnDutyPharmaciesService {
    constructor(
        private readonly searchRepository: SearchRepository,
        private readonly logger: Logger
    ) {}

    /**
     * Recherche uniquement les pharmacies DE GARDE dans une ville.
     */
    public async searchOnDutyInCity(params: {
        cityId?: string;
        cityName?: string;
        latitude?: number;
        longitude?: number;
        limit: number;
    }): Promise<PharmacyCityResult[]> {
        try {
            return await this.searchRepository.findOnDutyPharmaciesInCity({
                cityId: params.cityId,
                cityName: params.cityName,
                lat: params.latitude,
                lon: params.longitude,
                limit: params.limit
            });
        } catch (error) {
            this.logger.error('Error in SearchOnDutyPharmaciesService:', error);
            throw error;
        }
    }
}
