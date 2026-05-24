import { Request, Response, NextFunction } from 'express';
import { GetDeliveryByIdService } from '../services/get-delivery-id.service';

export class GetDeliveryByIdController {
    constructor(private readonly getByIdService: GetDeliveryByIdService) {}

    public getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const delivery = await this.getByIdService.getById(req.params.id as string);
            return res.status(200).json({
                success: true,
                data: delivery
            });
        } catch (error) {
            next(error);
        }
    }
}
