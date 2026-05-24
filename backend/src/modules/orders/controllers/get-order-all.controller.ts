import { Request, Response, NextFunction } from 'express';
import { GetOrderAllService } from '../services/get-order-all.service';
import { queryOrderSchema } from '../validations/get-order-all.validations';

export class GetOrderAllController {
    constructor(private readonly getAllService: GetOrderAllService) {}

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = queryOrderSchema.parse({ ...req.query });
            const result = await this.getAllService.getAll(filters as any);
            return res.status(200).json({
                success: true,
                data: result.orders,
                meta: { total: result.total, page: filters.page, limit: filters.limit }
            });
        } catch (error) {
            next(error);
        }
    }
}
