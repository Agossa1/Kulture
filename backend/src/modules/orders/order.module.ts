import PostgresDatabase from '../../infra/database/postgres';
import type { Logger } from 'winston';
import { OrderRepository } from './repositories/order.repositories';

import { GetOrderAllService } from './services/get-order-all.service';
import { GetOrderByIdService } from './services/get-order-id.service';
import { CreateOrderService } from './services/create.order.service';
import { UpdateOrderStatusService } from './services/update.order.service';
import { CancelOrderService } from './services/cancel.order.service';

import { GetOrderAllController } from './controllers/get-order-all.controller';
import { GetOrderByIdController } from './controllers/get-order-id.controller';
import { CreateOrderController } from './controllers/create.order.controller';
import { UpdateOrderStatusController } from './controllers/update.order.controller';
import { CancelOrderController } from './controllers/cancel.order.controller';

/**
 * Module Orders.
 * Centralise l'injection de dépendances pour le domaine des commandes.
 */
export class OrderModule {
    public readonly getAllController: GetOrderAllController;
    public readonly getByIdController: GetOrderByIdController;
    public readonly createController: CreateOrderController;
    public readonly updateStatusController: UpdateOrderStatusController;
    public readonly cancelController: CancelOrderController;

    constructor(db: PostgresDatabase, logger: Logger) {
        // 1. Repository
        const orderRepository = new OrderRepository(db, logger);

        // 2. Services
        const getAllService = new GetOrderAllService(orderRepository, logger);
        const getByIdService = new GetOrderByIdService(orderRepository, logger);
        const createService = new CreateOrderService(orderRepository, logger);
        const updateService = new UpdateOrderStatusService(orderRepository, logger);
        const cancelService = new CancelOrderService(orderRepository, logger);

        // 3. Contrôleurs
        this.getAllController = new GetOrderAllController(getAllService);
        this.getByIdController = new GetOrderByIdController(getByIdService);
        this.createController = new CreateOrderController(createService);
        this.updateStatusController = new UpdateOrderStatusController(updateService);
        this.cancelController = new CancelOrderController(cancelService);
    }
}
