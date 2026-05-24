import { Request, Response, NextFunction } from 'express';
import { GetStockAllService } from '../services/get-stock-all.service';
import { queryStockSchema } from '../validations/get-stock-all.validations';

export class GetStockAllController {
    constructor(private readonly getAllService: GetStockAllService) {}

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = queryStockSchema.parse({
                ...req.query,
            });
            
            const result = await this.getAllService.getAll(filters as any);
            
            return res.status(200).json({
                success: true,
                data: result.stocks,
                meta: {
                    total: result.total,
                    page: filters.page || 1,
                    limit: filters.limit || 20
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
