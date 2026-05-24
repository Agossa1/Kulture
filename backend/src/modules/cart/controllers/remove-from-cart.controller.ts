import { Request, Response, NextFunction } from 'express';
import { RemoveFromCartService } from '../services/remove-from-cart.service';

export class RemoveFromCartController {
    constructor(private readonly removeService: RemoveFromCartService) {}

    public remove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.removeService.remove(req.params.itemId as string);
            return res.status(200).json({
                success: true,
                message: 'Produit retiré du panier'
            });
        } catch (error) {
            next(error);
        }
    }
}
