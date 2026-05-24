import { Request, Response, NextFunction } from 'express';
import { UpdateCartItemService } from '../services/update-cart-item.service';
import { updateCartItemSchema } from '../validations/update-cart-item.validations';

export class UpdateCartItemController {
    constructor(private readonly updateService: UpdateCartItemService) {}

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = updateCartItemSchema.parse(req.body);
            await this.updateService.update(req.params.itemId as string, validatedData.quantity);
            
            return res.status(200).json({
                success: true,
                message: 'Quantité mise à jour'
            });
        } catch (error) {
            next(error);
        }
    }
}
