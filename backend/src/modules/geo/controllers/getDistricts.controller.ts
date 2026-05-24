import { Request, Response, NextFunction } from "express";
import { GetDistrictsService } from "../services/getDistricts.service";

export class GetDistrictsController {
    constructor(
        private readonly districtsService: GetDistrictsService
    ) {}

    public async getAllDistrictsController(req: Request, res: Response, next: NextFunction) {
        try {
            const districts = await this.districtsService.getAllDistricts();

            return res.status(200).json({
                success: true,
                data: districts,
                meta: { count: districts.length }
            });
        } catch (error) {
            next(error);
        }
    }
}