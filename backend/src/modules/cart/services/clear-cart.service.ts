import { CartRepository } from "../repositories/cart.repositories";
import type { Logger } from 'winston';

export class ClearCartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly logger: Logger
    ) {}

    public async clear(cartId: string): Promise<void> {
        try {
            await this.cartRepository.clearCart(cartId);
            this.logger.info(`Panier ${cartId} vidé`);
        } catch (error) {
            this.logger.error(`Error in ClearCartService for cart ${cartId}:`, error);
            throw error;
        }
    }
}
