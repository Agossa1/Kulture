import { Request, Response, NextFunction } from 'express';
import { CancelOrderService } from '../services/cancel.order.service';

export class CancelOrderController {
    constructor(private readonly cancelService: CancelOrderService) {}

    public cancel = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { reason } = req.body;
            const cancelled = await this.cancelService.cancel(req.params.id as string, reason);
            return res.status(200).json({
                success: true,
                message: 'Commande annulée avec succès',
                data: cancelled
            });
        } catch (error) {
            next(error);
        }
    }
}
