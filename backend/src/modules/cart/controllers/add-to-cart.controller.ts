import { Request, Response, NextFunction } from 'express';
import { AddToCartService } from '../services/add-to-cart.service';
import { addToCartSchema } from '../validations/add-to-cart.validations';

export class AddToCartController {
    constructor(private readonly addService: AddToCartService) {}

    public add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = addToCartSchema.parse(req.body);
            const updatedCart = await this.addService.add(validatedData as any);
            
            return res.status(200).json({
                success: true,
                message: 'Produit ajouté au panier',
                data: updatedCart
            });
        } catch (error) {
            next(error);
        }
    }
}
