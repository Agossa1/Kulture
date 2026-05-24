import { CartRepository } from "../repositories/cart.repositories";
import type { Logger } from 'winston';

export class RemoveFromCartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly logger: Logger
    ) {}

    public async remove(itemId: string): Promise<void> {
        try {
            await this.cartRepository.removeItem(itemId);
            this.logger.info(`Item ${itemId} retiré du panier`);
        } catch (error) {
            this.logger.error(`Error in RemoveFromCartService for item ${itemId}:`, error);
            throw error;
        }
    }
}
