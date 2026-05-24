import { Router } from 'express';
import PostgresDatabase from '../../../infra/database/postgres';
import { logger } from '../../../shared/loggers/logger';
import { CartModule } from '../cart.module';

import { authMiddleware } from '../../../shared/middlewares/auth.middleware';

/**
 * Configure les routes pour le module Cart.
 * @param db Instance de la base de données
 */
export const configureCartRoutes = (db: PostgresDatabase) => {
    const router = Router();
    const cartModule = new CartModule(db, logger);

    // Toutes les routes du panier nécessitent une authentification
    router.use(authMiddleware);

    // Récupérer le panier d'un utilisateur pour une pharmacie
    router.get('/:authId/:pharmacyId', cartModule.getCartController.getCart);
    
    // Ajouter un produit au panier
    router.post('/', cartModule.addToCartController.add);
    
    // Mettre à jour la quantité d'un item
    router.patch('/items/:itemId', cartModule.updateCartItemController.update);
    
    // Retirer un produit du panier
    router.delete('/items/:itemId', cartModule.removeFromCartController.remove);
    
    // Vider le panier
    router.delete('/:cartId', cartModule.clearCartController.clear);

    return router;
};
