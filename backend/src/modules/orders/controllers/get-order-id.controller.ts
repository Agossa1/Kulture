import { Request, Response, NextFunction } from 'express';
import { GetOrderByIdService } from '../services/get-order-id.service';

export class GetOrderByIdController {
    constructor(private readonly getByIdService: GetOrderByIdService) {}

    public getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const order = await this.getByIdService.getById(req.params.id as string);
            return res.status(200).json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }
}
