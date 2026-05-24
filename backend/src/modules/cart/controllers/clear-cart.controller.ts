import { Request, Response, NextFunction } from 'express';
import { ClearCartService } from '../services/clear-cart.service';

export class ClearCartController {
    constructor(private readonly clearService: ClearCartService) {}

    public clear = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.clearService.clear(req.params.cartId as string);
            return res.status(200).json({
                success: true,
                message: 'Panier vidé avec succès'
            });
        } catch (error) {
            next(error);
        }
    }
}
