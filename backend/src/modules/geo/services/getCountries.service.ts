import { Logger } from 'winston';
import { AppError, HttpCode } from '../../../shared/errors/appErrors';
import { GeoRepositories } from '../repositories/geo.repositorie';
import { Country } from '../types/geo.types';
import dotenv from "dotenv";
 dotenv.config()

const CACHE_TTL = process.env.CA
export class GetCountryService {
    constructor(
        private readonly geoRepository: GeoRepositories,
        private readonly logger: Logger,
        private readonly redis: any
    ) {}

    /**
     * Récupère tous les pays avec leur géométrie simplifiée selon la tolérance
     */
    public async getAllCountries(tolerance = 0.01): Promise<Country[]> {
        const cacheKey = `geo:countries:tolerance:${tolerance}`;

        const cached = await this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // 💡 AJOUT : Passage du paramètre tolerance au repository pour PostGIS
            const countries = await this.geoRepository.getCountriesList(tolerance);

            await this.setCache(cacheKey, countries);
            return countries;
        } catch (e) {
            this.logger.error(`[GetCountryService] getAllCountries échoué`, e);
            throw new AppError("Erreur interne lors de la récupération des pays.", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lit les données depuis le cache Redis
     */
    private async getFromCache(key: string): Promise<Country[] | null> {
        try {
            const cached = await this.redis.get(key);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            this.logger.warn(`[Redis] Lecture échouée (key=${key})`, error);
            return null;
        }
    }

    /**
     * Écrit les données dans le cache Redis
     */
    private async setCache(key: string, data: Country[]): Promise<void> {
        if (!data || data.length === 0) return;

        // 💡 CORRECTION : Utilisation du format standard (TTL en 3e argument) pour votre wrapper
        this.redis
            .set(key, JSON.stringify(data), CACHE_TTL)
            .catch((error: any) => this.logger.warn(`[Redis] Écriture échouée (key=${key})`, error));
    }
}
