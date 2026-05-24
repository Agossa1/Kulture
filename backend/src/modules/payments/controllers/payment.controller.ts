import { Request, Response, NextFunction } from 'express';
import { FedaPayService } from '../services/fedapay.service';

export class PaymentController {
    constructor(private readonly fedapayService: FedaPayService) {}

    /**
     * POST /api/v1/payments/initialize
     */
    async initialize(req: Request, res: Response, next: NextFunction) {
        try {
            const authId = (req as any).user.id;
            const url = await this.fedapayService.initializePayment(authId, req.body);
            res.status(200).json({
                status: 'success',
                data: { checkout_url: url }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/payments/webhook
     * Note: Cet endpoint doit être public (sans authMiddleware)
     */
    async webhook(req: Request, res: Response, next: NextFunction) {
        try {
            await this.fedapayService.handleWebhook(req.body);
            res.status(200).send('OK');
        } catch (error) {
            // FedaPay réessaiera si on ne renvoie pas 200, mais ici on veut éviter de boucler si c'est une erreur logique
            next(error);
        }
    }
}
