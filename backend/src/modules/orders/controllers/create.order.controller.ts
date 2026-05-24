import { Request, Response, NextFunction } from 'express';
import { CreateOrderService } from '../services/create.order.service';
import { createOrderSchema } from '../validations/create.order.validations';

export class CreateOrderController {
    constructor(private readonly createService: CreateOrderService) {}

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = createOrderSchema.parse(req.body);
            const newOrder = await this.createService.create(validatedData as any);
            return res.status(201).json({
                success: true,
                message: 'Commande créée avec succès',
                data: newOrder
            });
        } catch (error) {
            next(error);
        }
    }
}
