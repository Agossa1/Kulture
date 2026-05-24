import { CartRepository } from "../repositories/cart.repositories";
import type { Logger } from 'winston';
import { Cart, AddToCartDTO } from "../types/cart.types";

export class AddToCartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly logger: Logger
    ) {}

    public async add(dto: AddToCartDTO): Promise<Cart> {
        try {
            const updatedCart = await this.cartRepository.addItem(dto);
            this.logger.info(`Produit ajouté au panier pour l'utilisateur ${dto.authId}`);
            return updatedCart;
        } catch (error) {
            this.logger.error('Error in AddToCartService:', error);
            throw error;
        }
    }
}
