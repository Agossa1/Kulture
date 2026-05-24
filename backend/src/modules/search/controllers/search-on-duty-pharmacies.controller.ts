import { Request, Response, NextFunction } from 'express';
import { SearchOnDutyPharmaciesService } from '../services/search-on-duty-pharmacies.service';
import { searchPharmaciesByCitySchema } from '../validations/search.validations';

/**
 * Contrôleur gérant la recherche des pharmacies DE GARDE.
 */
export class SearchOnDutyPharmaciesController {
    constructor(private readonly searchService: SearchOnDutyPharmaciesService) {}

    /**
     * Point d'entrée de l'API pour chercher spécifiquement les pharmacies de garde d'une ville.
     */
    public searchOnDuty = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedParams = searchPharmaciesByCitySchema.parse(req.query);
            
            const result = await this.searchService.searchOnDutyInCity({
                cityId: validatedParams.cityId,
                cityName: validatedParams.cityName,
                latitude: validatedParams.latitude,
                longitude: validatedParams.longitude,
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
