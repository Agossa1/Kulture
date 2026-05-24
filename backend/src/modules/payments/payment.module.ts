import PostgresDatabase from '../../infra/database/postgres';
import type { Logger } from 'winston';
import { PaymentRepository } from './repositories/payment.repositories';
import { FedaPayService } from './services/fedapay.service';
import { PaymentController } from './controllers/payment.controller';
import { OrderRepository } from '../orders/repositories/order.repositories';

export class PaymentModule {
    public readonly controller: PaymentController;

    constructor(db: PostgresDatabase, logger: Logger) {
        const paymentRepository = new PaymentRepository(db, logger);
        const orderRepository = new OrderRepository(db, logger);
        
        const apiKey = process.env.FEDAPAY_SECRET_KEY || 'sk_sandbox_dummy';
        const environment = (process.env.FEDAPAY_ENV as any) || 'sandbox';

        const fedapayService = new FedaPayService(
            paymentRepository, 
            orderRepository, 
            logger, 
            apiKey, 
            environment
        );

        this.controller = new PaymentController(fedapayService);
    }
}
