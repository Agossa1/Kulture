import { FedaPay, Transaction } from 'fedapay';
import type { Logger } from 'winston';
import { PaymentRepository } from '../repositories/payment.repositories';
import { OrderRepository } from '../../orders/repositories/order.repositories';
import { PaymentStatus, InitializePaymentDTO } from '../types/payment.types';
import { AppError, NotFoundError } from '../../../shared/errors/appErrors';

export class FedaPayService {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly orderRepository: OrderRepository,
        private readonly logger: Logger,
        private readonly apiKey: string,
        private readonly environment: 'sandbox' | 'live' = 'sandbox'
    ) {
        FedaPay.setApiKey(this.apiKey);
        FedaPay.setEnvironment(this.environment);
    }

    /**
     * Initialise un paiement FedaPay pour une commande.
     */
    async initializePayment(authId: string, dto: InitializePaymentDTO): Promise<string> {
        try {
            // 1. Récupérer la commande
            const order = await this.orderRepository.findById(dto.orderId);
            if (!order) throw new NotFoundError('Commande non trouvée');
            if (order.authId !== authId) throw new AppError('Accès non autorisé à cette commande', 403);

            // 2. Créer la transaction chez FedaPay
            const fedaTransaction = await Transaction.create({
                description: `Paiement Commande #${order.id} - DOTO`,
                amount: Math.round(Number(order.totalAmount)), // FedaPay veut des entiers
                currency: { iso: 'XOF' },
                callback_url: dto.callbackUrl,
                reference: order.id,
            });

            const token = await fedaTransaction.generateToken();

            // 3. Enregistrer en base locale
            await this.paymentRepository.createTransaction({
                orderId: order.id,
                authId: authId,
                amount: Number(order.totalAmount),
                currency: 'XOF',
                status: PaymentStatus.PENDING,
                provider: 'fedapay',
                providerTransactionId: fedaTransaction.id.toString(),
                paymentUrl: token.url
            });

            this.logger.info(`Paiement initialisé pour la commande ${order.id}`);
            return token.url;
        } catch (error) {
            this.logger.error('Erreur initialisation paiement FedaPay:', error);
            throw error;
        }
    }

    /**
     * Traite le webhook de FedaPay pour mettre à jour le statut.
     */
    async handleWebhook(body: any): Promise<void> {
        const event = body.event;
        const transaction = body.entity;

        this.logger.info(`Webhook FedaPay reçu : ${event} pour transaction ${transaction.id}`);

        if (event === 'transaction.approved') {
            await this.paymentRepository.updateStatus(transaction.id.toString(), PaymentStatus.SUCCESS);
            // Mettre à jour la commande
            const orderId = transaction.reference;
            await this.orderRepository.updateStatus(orderId, { status: 'validated' as any });
            this.logger.info(`Commande ${orderId} marquée comme payée et validée.`);
        } else if (event === 'transaction.canceled' || event === 'transaction.declined') {
            await this.paymentRepository.updateStatus(transaction.id.toString(), PaymentStatus.FAILED);
            this.logger.warn(`Paiement échoué pour la transaction ${transaction.id}`);
        }
    }
}
