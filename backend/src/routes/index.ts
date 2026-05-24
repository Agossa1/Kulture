import { Router } from 'express';
import PostgresDatabase from '../infra/database/postgres';
import { configureAuthRoutes } from '../modules/auth/routes/auth.routes';

import { configureOrderRoutes } from '../modules/orders/routes/order.routes';
import { configureProfileRoutes } from '../modules/profile/routes/profile.routes';
import { configureCartRoutes } from '../modules/cart/routes/cart.routes';
import { configureDeliveryRoutes } from '../modules/delivery/routes/delivery.routes';
import { configureNotificationRoutes } from '../modules/notifications/routes/notification.routes';
import { configurePaymentRoutes } from '../modules/payments/routes/payment.routes';
import { PaymentModule } from '../modules/payments/payment.module';
import { logger } from '../shared/loggers/logger';
import { configureAddressesRoutes } from '../modules/addresses/routes/addresses.routes';
import {configureGeoRoute} from "../modules/geo/routes/geo.route";

/**
 * Point d'entrée centralisé pour toutes les routes de l'API.
 * @param db Instance de la base de données pour l'injection de dépendances
 */
export const configureRoutes = (db: PostgresDatabase) => {
    const router = Router();

    // Montage des modules
    router.use('/auth', configureAuthRoutes(db));
    router.use('/countries', configureGeoRoute(db))

    router.use('/orders', configureOrderRoutes(db));
    router.use('/profile', configureProfileRoutes(db));
    router.use('/cart', configureCartRoutes(db));
    router.use('/delivery', configureDeliveryRoutes(db));
    router.use('/notifications', configureNotificationRoutes(db));
    router.use('/addresses', configureAddressesRoutes(db));
    
    // Paiements
    const paymentModule = new PaymentModule(db, logger);
    router.use('/payments', configurePaymentRoutes(paymentModule.controller));

    // Ajoutez ici les autres modules (ex: /pharmacies, /orders, etc.)

    return router;
};