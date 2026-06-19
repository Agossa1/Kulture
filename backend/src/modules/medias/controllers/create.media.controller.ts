import { Request, Response, NextFunction } from 'express';
import { CreateStockService } from '../services/create.stock.service';
import { createStockSchema } from '../validations/create.stock.validations';

export class CreateStockController {
    constructor(private readonly createService: CreateStockService) {}

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = createStockSchema.parse(req.body);
            const newStock = await this.createService.create(validatedData as any);
            
            return res.status(201).json({
                success: true,
                message: 'Lot de stock créé avec succès',
                data: newStock
            });
        } catch (error) {
            next(error);
        }
    }
}
