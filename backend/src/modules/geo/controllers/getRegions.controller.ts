import { Request, Response, NextFunction } from "express";
import { GetRegionsService } from "../services/getRegions.service";

export class GetRegionsController {
    constructor(
        private readonly regionsService: GetRegionsService
    ) {}

    public async getAllRegionsController(req: Request, res: Response, next: NextFunction) {
        try {
            const regions = await this.regionsService.getAllRegions();

            return res.status(200).json({
                success: true,
                data: regions,
                meta: { count: regions.length }
            });
        } catch (error) {
            next(error);
        }
    }
}