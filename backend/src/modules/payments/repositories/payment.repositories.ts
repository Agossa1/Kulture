import PostgresDatabase from "../../../infra/database/postgres";
import type { Logger } from 'winston';
import { PaymentTransaction, PaymentStatus } from "../types/payment.types";

export class PaymentRepository {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger
    ) {}

    async createTransaction(data: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentTransaction> {
        const query = `
            INSERT INTO payments (order_id, auth_id, amount, currency, status, provider, provider_transaction_id, payment_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            data.orderId,
            data.authId,
            data.amount,
            data.currency,
            data.status,
            data.provider,
            data.providerTransactionId,
            data.paymentUrl
        ];

        const result = await this.db.query(query, values);
        return result.rows[0];
    }

    async updateStatus(providerTransactionId: string, status: PaymentStatus): Promise<void> {
        const query = `
            UPDATE payments 
            SET status = $1, updated_at = NOW()
            WHERE provider_transaction_id = $2;
        `;
        await this.db.query(query, [status, providerTransactionId]);
    }

    async findByOrderId(orderId: string): Promise<PaymentTransaction | null> {
        const query = `SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1;`;
        const result = await this.db.query(query, [orderId]);
        return result.rows[0] || null;
    }
}
