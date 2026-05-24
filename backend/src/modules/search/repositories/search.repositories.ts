import type { Logger } from 'winston';
import PostgresDatabase from '../../../infra/database/postgres';
import { NearbyPharmacySuggestion, CitySuggestion } from '../types/search.types';
import { BadRequestError } from '../../../shared/errors/appErrors';

export class SearchRepository {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger
    ) {}

    /**
     * Recherche les pharmacies proches disposant du médicament en stock.
     * Utilise PostGIS (ST_DWithin et ST_DistanceSphere) pour les calculs spatiaux.
     */
    public async findNearbyPharmaciesWithStock(
        medicineId: string, 
        lon: number, 
        lat: number, 
        radiusKm: number, 
        limit: number
    ): Promise<NearbyPharmacySuggestion[]> {
        try {
            const sql = `
                SELECT 
                    p.id as "pharmacyId", 
                    p.name as "pharmacyName", 
                    a.street as "addressStreet",
                    ST_DistanceSphere(a.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) / 1000 as "distanceKm",
                    SUM(s.quantity) as "availableQuantity",
                    MIN(s.price) as "price",
                    COALESCE(ps.is_on_duty, false) as "isOnDuty"
                FROM pharmacy p
                JOIN address a ON p.address_id = a.id
                JOIN stock s ON p.id = s.pharmacy_id
                LEFT JOIN pharmacy_status ps ON p.id = ps.pharmacy_id
                WHERE s.medicine_id = $3 
                  AND s.quantity > 0
                  AND ST_DWithin(a.location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $4 * 1000)
                GROUP BY p.id, p.name, a.street, a.location, ps.is_on_duty
                ORDER BY "distanceKm" ASC
                LIMIT $5;
            `;
            const result = await this.db.query(sql, [lon, lat, medicineId, radiusKm, limit]);
            return result.rows;
        } catch (error) {
            this.logger.error('Error in findNearbyPharmaciesWithStock:', error);
            throw new BadRequestError('Erreur lors de la recherche des pharmacies de proximité');
        }
    }

    /**
     * Recherche les villes proches (rayon étendu) où le médicament est disponible.
     * Utile si aucune pharmacie n'est trouvée dans le rayon immédiat.
     */
    public async findNearbyCitiesWithStock(
        medicineId: string, 
        lon: number, 
        lat: number, 
        radiusKm: number, 
        limit: number
    ): Promise<CitySuggestion[]> {
        try {
            const extendedRadius = radiusKm + 30; // Recherche plus large (ex: +30km)
            
            const sql = `
                SELECT 
                    c.id as "cityId", 
                    c.name as "cityName", 
                    r.name as "regionName",
                    COUNT(DISTINCT p.id) as "availablePharmaciesCount",
                    MIN(s.price) as "minPrice",
                    ST_DistanceSphere(ST_Centroid(c.geometry), ST_SetSRID(ST_MakePoint($1, $2), 4326)) / 1000 as "distanceKm"
                FROM city c
                JOIN region r ON c.region_id = r.id
                JOIN neighborhood n ON n.city_id = c.id
                JOIN address a ON a.neighborhood_id = n.id
                JOIN pharmacy p ON p.address_id = a.id
                JOIN stock s ON p.id = s.pharmacy_id
                WHERE s.medicine_id = $3 
                  AND s.quantity > 0
                  AND ST_DWithin(c.geometry::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $4 * 1000)
                GROUP BY c.id, c.name, r.name, c.geometry
                ORDER BY "distanceKm" ASC
                LIMIT $5;
            `;
            const result = await this.db.query(sql, [lon, lat, medicineId, extendedRadius, limit]);
            return result.rows;
        } catch (error) {
            this.logger.error('Error in findNearbyCitiesWithStock:', error);
            throw new BadRequestError('Erreur lors de la recherche des villes de proximité');
        }
    }

    /**
     * Vérifie la disponibilité spécifique dans une pharmacie cible.
     */
    public async checkAvailabilityInPharmacy(medicineId: string, pharmacyId: string): Promise<boolean> {
        try {
            const sql = `
                SELECT SUM(quantity) as "totalQuantity" 
                FROM stock 
                WHERE medicine_id = $1 AND pharmacy_id = $2
            `;
            const result = await this.db.query(sql, [medicineId, pharmacyId]);
            const qty = parseInt(result.rows[0]?.totalQuantity || '0');
            return qty > 0;
        } catch (error) {
            this.logger.error('Error checking specific pharmacy availability:', error);
            return false;
        }
    }

    /**
     * Recherche toutes les pharmacies dans une ville, sans distinction de garde.
     */
    public async findAllPharmaciesInCity(params: {
        cityId?: string;
        cityName?: string;
        lat?: number;
        lon?: number;
        limit: number;
    }): Promise<any[]> {
        return this.executePharmacySearch({ ...params, isOnDuty: undefined });
    }

    /**
     * Recherche UNIQUEMENT les pharmacies de garde dans une ville.
     */
    public async findOnDutyPharmaciesInCity(params: {
        cityId?: string;
        cityName?: string;
        lat?: number;
        lon?: number;
        limit: number;
    }): Promise<any[]> {
        return this.executePharmacySearch({ ...params, isOnDuty: true });
    }

    /**
     * Méthode privée factorisant la logique SQL pour éviter la duplication.
     */
    private async executePharmacySearch(params: {
        cityId?: string;
        cityName?: string;
        isOnDuty?: boolean;
        lat?: number;
        lon?: number;
        limit: number;
    }): Promise<any[]> {
        try {
            let sql = `
                SELECT 
                    p.id as "pharmacyId", 
                    p.name as "pharmacyName", 
                    a.street as "addressStreet",
                    n.name as "neighborhoodName",
                    ps.status,
                    COALESCE(ps.is_on_duty, false) as "isOnDuty",
                    pi.phone_number as "phoneNumber"
                FROM pharmacy p
                JOIN address a ON p.address_id = a.id
                JOIN neighborhood n ON a.neighborhood_id = n.id
                JOIN city c ON n.city_id = c.id
                LEFT JOIN pharmacy_status ps ON p.id = ps.pharmacy_id
                LEFT JOIN pharmacy_info pi ON p.id = pi.pharmacy_id
                WHERE 1=1
            `;
            
            const queryParams: any[] = [];
            let paramIdx = 1;

            if (params.cityId) {
                sql += ` AND c.id = $${paramIdx++}`;
                queryParams.push(params.cityId);
            } else if (params.cityName) {
                sql += ` AND c.name ILIKE $${paramIdx++}`;
                queryParams.push(`%${params.cityName}%`);
            }

            if (params.isOnDuty !== undefined) {
                sql += ` AND ps.is_on_duty = $${paramIdx++}`;
                queryParams.push(params.isOnDuty);
            }

            if (params.lat !== undefined && params.lon !== undefined) {
                // Si coordonnées fournies, trier par distance
                sql = sql.replace('SELECT ', `SELECT ST_DistanceSphere(a.location, ST_SetSRID(ST_MakePoint($${paramIdx}, $${paramIdx+1}), 4326)) / 1000 as "distanceKm", `);
                queryParams.push(params.lon, params.lat);
                paramIdx += 2;
                sql += ` ORDER BY "distanceKm" ASC`;
            } else {
                sql += ` ORDER BY p.name ASC`;
            }

            sql += ` LIMIT $${paramIdx}`;
            queryParams.push(params.limit);

            const result = await this.db.query(sql, queryParams);
            return result.rows;
        } catch (error) {
            this.logger.error('Error in executePharmacySearch:', error);
            throw new BadRequestError('Erreur lors de la recherche des pharmacies');
        }
    }
}
