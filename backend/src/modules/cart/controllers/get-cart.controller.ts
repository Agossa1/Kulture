import { Request, Response, NextFunction } from 'express';
import { GetCartService } from '../services/get-cart.service';

export class GetCartController {
    constructor(private readonly getService: GetCartService) {}

    public getCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authId, pharmacyId } = req.params;
            const cart = await this.getService.getCart(authId as string, pharmacyId as string);
            
            return res.status(200).json({
                success: true,
                data: cart || { items: [] }
            });
        } catch (error) {
            next(error);
        }
    }
}
