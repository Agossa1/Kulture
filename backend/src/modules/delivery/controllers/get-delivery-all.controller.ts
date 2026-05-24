import { Request, Response, NextFunction } from 'express';
import { GetDeliveryAllService } from '../services/get-delivery-all.service';

export class GetDeliveryAllController {
    constructor(private readonly getAllService: GetDeliveryAllService) {}

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = {
                status: req.query.status as any,
                deliveryPersonId: req.query.deliveryPersonId as string,
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 20
            };
            
            const result = await this.getAllService.getAll(filters);
            
            return res.status(200).json({
                success: true,
                data: result.deliveries,
                meta: {
                    total: result.total,
                    page: filters.page,
                    limit: filters.limit
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
