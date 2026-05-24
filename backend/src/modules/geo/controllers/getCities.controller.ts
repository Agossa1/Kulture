import { Request, Response, NextFunction } from "express";
import { GetCitiesService } from "../services/getCities.service";
import { queryCitySchema } from "../validations/getCities.validation";

export class GetCitiesController {
    constructor(
        private readonly citiesService: GetCitiesService
    ) {}

    public async getAllCitiesController(req: Request, res: Response, next: NextFunction) {
        try {
            const filter = queryCitySchema.parse(req.query);
            // Note: The service currently expects tolerance, but the repo expects regionId.
            // Based on getCities.service.ts, it's currently defined as getAllCitiesServices(tolerance)
            const cities = await this.citiesService.getAllCitiesServices(filter.tolerance);

            return res.status(200).json({
                success: true,
                data: cities
            });
        } catch (error) {
            next(error);
        }
    }
}
