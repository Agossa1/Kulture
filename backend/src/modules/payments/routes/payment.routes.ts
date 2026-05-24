import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';

export function configurePaymentRoutes(controller: PaymentController): Router {
    const router = Router();

    // Initialisation du paiement (nécessite d'être connecté)
    router.post('/initialize', authMiddleware, (req, res, next) => controller.initialize(req, res, next));

    // Webhook FedaPay (doit être public pour que FedaPay puisse l'appeler)
    router.post('/webhook', (req, res, next) => controller.webhook(req, res, next));

    return router;
}
