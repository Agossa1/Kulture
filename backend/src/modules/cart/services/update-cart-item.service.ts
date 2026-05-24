import { CartRepository } from "../repositories/cart.repositories";
import type { Logger } from 'winston';

export class UpdateCartItemService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly logger: Logger
    ) {}

    public async update(itemId: string, quantity: number): Promise<void> {
        try {
            await this.cartRepository.updateItemQuantity(itemId, quantity);
            this.logger.info(`Quantité de l'item ${itemId} mise à jour`);
        } catch (error) {
            this.logger.error(`Error in UpdateCartItemService for item ${itemId}:`, error);
            throw error;
        }
    }
}
