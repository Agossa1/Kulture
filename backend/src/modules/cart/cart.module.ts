import PostgresDatabase from '../../infra/database/postgres';
import type { Logger } from 'winston';
import { CartRepository } from './repositories/cart.repositories';

import { GetCartService } from './services/get-cart.service';
import { AddToCartService } from './services/add-to-cart.service';
import { UpdateCartItemService } from './services/update-cart-item.service';
import { RemoveFromCartService } from './services/remove-from-cart.service';
import { ClearCartService } from './services/clear-cart.service';

import { GetCartController } from './controllers/get-cart.controller';
import { AddToCartController } from './controllers/add-to-cart.controller';
import { UpdateCartItemController } from './controllers/update-cart-item.controller';
import { RemoveFromCartController } from './controllers/remove-from-cart.controller';
import { ClearCartController } from './controllers/clear-cart.controller';

/**
 * Module Cart.
 * Gère le panier d'achat des utilisateurs.
 */
export class CartModule {
    public readonly getCartController: GetCartController;
    public readonly addToCartController: AddToCartController;
    public readonly updateCartItemController: UpdateCartItemController;
    public readonly removeFromCartController: RemoveFromCartController;
    public readonly clearCartController: ClearCartController;

    constructor(db: PostgresDatabase, logger: Logger) {
        // 1. Repository
        const cartRepository = new CartRepository(db, logger);

        // 2. Services
        const getCartService = new GetCartService(cartRepository, logger);
        const addToCartService = new AddToCartService(cartRepository, logger);
        const updateCartItemService = new UpdateCartItemService(cartRepository, logger);
        const removeFromCartService = new RemoveFromCartService(cartRepository, logger);
        const clearCartService = new ClearCartService(cartRepository, logger);

        // 3. Contrôleurs
        this.getCartController = new GetCartController(getCartService);
        this.addToCartController = new AddToCartController(addToCartService);
        this.updateCartItemController = new UpdateCartItemController(updateCartItemService);
        this.removeFromCartController = new RemoveFromCartController(removeFromCartService);
        this.clearCartController = new ClearCartController(clearCartService);
    }
}
