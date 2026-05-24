import { CartRepository } from "../repositories/cart.repositories";
import type { Logger } from 'winston';
import { Cart } from "../types/cart.types";

export class GetCartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly logger: Logger
    ) {}

    public async getCart(authId: string, pharmacyId: string): Promise<Cart | null> {
        try {
            return await this.cartRepository.findCart(authId, pharmacyId);
        } catch (error) {
            this.logger.error(`Error in GetCartService for user ${authId}:`, error);
            throw error;
        }
    }
}
