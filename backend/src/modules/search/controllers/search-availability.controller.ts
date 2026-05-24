import { Request, Response, NextFunction } from 'express';
import { SearchAvailabilityService } from '../services/search-availability.service';
import { searchAvailabilitySchema } from '../validations/search.validations';

/**
 * Contrôleur gérant la recherche de disponibilité des médicaments.
 */
export class SearchAvailabilityController {
    constructor(private readonly searchService: SearchAvailabilityService) {}

    /**
     * Point d'entrée de l'API pour chercher un médicament autour d'une position GPS.
     */
    public search = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validation et parsing des coordonnées GPS et paramètres
            const validatedParams = searchAvailabilitySchema.parse(req.query);
            
            const result = await this.searchService.searchAvailability({
                medicineId: validatedParams.medicineId,
                latitude: validatedParams.latitude,
                longitude: validatedParams.longitude,
                radiusKm: validatedParams.radiusKm,
                targetPharmacyId: validatedParams.targetPharmacyId,
                limit: validatedParams.limit
            });
            
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
