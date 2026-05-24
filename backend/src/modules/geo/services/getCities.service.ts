import {GeoRepositories} from "../repositories/geo.repositorie";
import {Logger} from "winston";
import {City} from "../types/geo.types";
import dotenv from "dotenv";
dotenv.config()

const CACHE_TTL = process.env.CACHE_TTL;
export class GetCitiesService {
    constructor(
        private readonly getCitiesRepo: GeoRepositories,
        private readonly logger: Logger,
        private readonly redis:any
    ) {}

    private async getFromCache(key:string):Promise<City[] | null> {
        try {
            const cached = await this.redis.get(key)
            return cached ? JSON.parse(cached) : null;
        }catch (error) {
            this.logger.warn(`[Redis] Lecture échouée (key=${key})`, error);
            return null;
        }
    }

    private async setCache(key: string, data: City[]): Promise<void> {
        try {
            if (data && data.length > 0) {
                const ttl = CACHE_TTL ? parseInt(CACHE_TTL, 10) : 3600;
                await this.redis.set(key, JSON.stringify(data), { EX: ttl });
            }
        } catch (error) {
            this.logger.warn(`[Redis] Écriture échouée (key=${key})`, error);
        }
    }

    public async getAllCitiesServices(tolerance = 0.01): Promise<City[]> {
        const cachekey = `geo:cities:tolerance:${tolerance}`;
        const cached = await this.getFromCache(cachekey);
        if(cached) return cached;

        try {
            const cities = await this.getCitiesRepo.getCitiesList(tolerance.toString());
            await this.setCache(cachekey, cities);
            return cities;
        }catch (error) {
            this.logger.error(`[GetCitiesService] getAllCitiesServices échoué`, error);
            throw new Error("Erreur interne lors de la récupération des villes.");
        }
    }
}