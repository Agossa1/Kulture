import { SearchRepository } from "../repositories/search.repositories";
import type { Logger } from 'winston';
import { PharmacyCityResult } from "../types/search.types";

export class SearchAllPharmaciesService {
    constructor(
        private readonly searchRepository: SearchRepository,
        private readonly logger: Logger
    ) {}

    /**
     * Recherche toutes les pharmacies dans une ville, sans filtrage de garde.
     */
    public async searchAllInCity(params: {
        cityId?: string;
        cityName?: string;
        latitude?: number;
        longitude?: number;
        limit: number;
    }): Promise<PharmacyCityResult[]> {
        try {
            return await this.searchRepository.findAllPharmaciesInCity({
                cityId: params.cityId,
                cityName: params.cityName,
                lat: params.latitude,
                lon: params.longitude,
                limit: params.limit
            });
        } catch (error) {
            this.logger.error('Error in SearchAllPharmaciesService:', error);
            throw error;
        }
    }
}
