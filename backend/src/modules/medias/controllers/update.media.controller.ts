import { Request, Response, NextFunction } from 'express';
import { UpdateStockService } from '../services/update.stock.service';
import { updateStockSchema } from '../validations/update.stock.validations';

export class UpdateStockController {
    constructor(private readonly updateService: UpdateStockService) {}

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = updateStockSchema.parse(req.body);
            const updatedStock = await this.updateService.update(req.params.id as string, validatedData as any);
            
            return res.status(200).json({
                success: true,
                message: 'Stock mis à jour avec succès',
                data: updatedStock
            });
        } catch (error) {
            next(error);
        }
    }
}
