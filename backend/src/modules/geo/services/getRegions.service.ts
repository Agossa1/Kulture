import { GeoRepositories } from "../repositories/geo.repositorie";
import { Logger } from "winston";
import { Region } from "../types/geo.types";
import dotenv from "dotenv";
dotenv.config();

const CACHE_TTL = process.env.CACHE_TTL;

export class GetRegionsService {
    constructor(
        private readonly geoRepo: GeoRepositories,
        private readonly logger: Logger,
        private readonly redis: any
    ) {}

    private async getFromCache(key: string): Promise<Region[] | null> {
        try {
            const cached = await this.redis.get(key);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            this.logger.warn(`[Redis] Lecture échouée (key=${key})`, error);
            return null;
        }
    }

    private async setCache(key: string, data: Region[]): Promise<void> {
        try {
            if (data && data.length > 0) {
                const ttl = CACHE_TTL ? parseInt(CACHE_TTL, 10) : 3600;
                await this.redis.set(key, JSON.stringify(data), { EX: ttl });
            }
        } catch (error) {
            this.logger.warn(`[Redis] Écriture échouée (key=${key})`, error);
        }
    }

    public async getAllRegions(): Promise<Region[]> {
        const cacheKey = "geo:regions:all";
        const cached = await this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const regions = await this.geoRepo.getRegionsLists(cacheKey);
            await this.setCache(cacheKey, regions);
            return regions;
        } catch (error) {
            this.logger.error(`[GetRegionsService] getAllRegions échoué`, error);
            throw new Error("Erreur interne lors de la récupération des régions.");
        }
    }
}