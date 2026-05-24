import PostgresDatabase from "../../infra/database/postgres";
import { createLogger } from "../../utils/logger";

const logger = createLogger('payment-migration');

async function migrate() {
    const db = new PostgresDatabase();
    try {
        await db.connect();
        logger.info('Migrating Payment table...');

        const query = `
            CREATE TABLE IF NOT EXISTS payments (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                auth_id UUID NOT NULL REFERENCES auth(id) ON DELETE CASCADE,
                amount DECIMAL(12, 2) NOT NULL,
                currency VARCHAR(10) DEFAULT 'XOF',
                status VARCHAR(20) DEFAULT 'pending',
                provider VARCHAR(50) DEFAULT 'fedapay',
                provider_transaction_id VARCHAR(100),
                payment_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
            CREATE INDEX IF NOT EXISTS idx_payments_provider_id ON payments(provider_transaction_id);
        `;

        await db.query(query);
        logger.info('Payment table migrated successfully! ✅');
    } catch (error) {
        logger.error('Migration failed ❌', error);
    } finally {
        await db.disconnect();
    }
}

migrate();
