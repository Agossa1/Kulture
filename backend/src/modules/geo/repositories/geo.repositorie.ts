import { Logger } from "winston";
import PostgresDatabase from "../../../infra/database/postgres";
import { Country, Region, City, District } from "../types/geo.types";
import { BadRequestError } from "../../../shared/errors/appErrors";

export class GeoRepositories {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger,
    ) {}

    /**
     * Récupère la liste de tous les pays avec leur géométrie simplifiée (Chargement initial)
     */
    public async getCountriesList(tolerance = 0.01): Promise<Country[]> {
        try {
            const sql = `
                SELECT id, name, code, area_sqkm, center_lat, center_lon,
                       ST_AsGeoJSON(ST_Simplify(geom, $1)) as geometry
                FROM countries
                ORDER BY name ASC`;
            const result = await this.db.query(sql, [tolerance]);
            return result;
        } catch (error) {
            this.logger.error(`Erreur lors de la récupération des pays`, error);
            throw new BadRequestError('Error retrieving countries list');
        }
    }

    /**
     * Récupère uniquement les régions associées à un pays avec leur géométrie simplifiée (Lazy Loading)
     */
    public async getRegionsLists(countryId: string, tolerance = 0.01): Promise<Region[]> {
        try {
            const sql = `
                SELECT id, country_id, name, code,
                       ST_AsGeoJSON(ST_Simplify(geom, $2)) as geometry
                FROM regions
                WHERE country_id = $1
                ORDER BY name ASC`;
            const result = await this.db.query(sql, [countryId, tolerance]);
            return result;
        } catch (error) {
            this.logger.error(`Erreur de récupération des régions pour le pays ID: ${countryId}`, error);
            throw new BadRequestError('Error retrieving regions list');
        }
    }

    /**
     * Récupère uniquement les villes associées à une région (Lazy Loading)
     * Note: Les villes étant souvent représentées par des Points (Latitude/Longitude),
     * ST_Simplify est inutile ici. On extrait directement le GeoJSON natif.
     */
    public async getCitiesList(regionId: string, tolerance =0.01): Promise<City[]> {
        try {
            const sql = `
                SELECT id, region_id, name, code, area_sqkm, center_lat, center_lon,
                       ST_AsGeoJSON(geom) as geometry
                FROM cities
                WHERE region_id = $1
                ORDER BY name ASC`;
            const result = await this.db.query(sql, [regionId, tolerance]);
            return result;
        } catch (error) {
            this.logger.error(`Erreur de récupération des villes pour la région ID: ${regionId}`, error);
            throw new BadRequestError('Error retrieving cities list');
        }
    }

    /**
     * Récupère uniquement les districts associés à une ville avec leur géométrie simplifiée (Lazy Loading)
     */
    public async getDistrictsList(cityId: string, tolerance = 0.005): Promise<District[]> {
        try {
            const sql = `
                SELECT id, city_id, name, code, area_sqkm, population, center_lat, center_lon,
                       ST_AsGeoJSON(ST_Simplify(geom, $2)) as geometry
                FROM districts
                WHERE city_id = $1
                ORDER BY name ASC`;
            const result = await this.db.query(sql, [cityId, tolerance]);
            return result;
        } catch (error) {
            this.logger.error(`Erreur de récupération des districts pour la ville ID: ${cityId}`, error);
            throw new BadRequestError('Error retrieving districts list');
        }
    }
}
