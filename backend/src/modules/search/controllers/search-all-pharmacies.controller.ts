import { Request, Response, NextFunction } from 'express';
import { SearchAllPharmaciesService } from '../services/search-all-pharmacies.service';
import { searchPharmaciesByCitySchema } from '../validations/search.validations';

/**
 * Contrôleur gérant la recherche de TOUTES les pharmacies.
 */
export class SearchAllPharmaciesController {
    constructor(private readonly searchService: SearchAllPharmaciesService) {}

    /**
     * Point d'entrée de l'API pour chercher toutes les pharmacies d'une ville.
     */
    public searchAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedParams = searchPharmaciesByCitySchema.parse(req.query);
            
            const result = await this.searchService.searchAllInCity({
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
