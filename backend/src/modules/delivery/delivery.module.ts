import PostgresDatabase from '../../infra/database/postgres';
import type { Logger } from 'winston';
import { DeliveryRepository } from './repositories/delivery.repositories';

import { GetDeliveryAllService } from './services/get-delivery-all.service';
import { GetDeliveryByIdService } from './services/get-delivery-id.service';
import { AssignDeliveryService } from './services/assign-delivery.service';
import { UpdateDeliveryStatusService } from './services/update-delivery-status.service';
import { UpdatePositionService } from './services/update-position.service';

import { GetDeliveryAllController } from './controllers/get-delivery-all.controller';
import { GetDeliveryByIdController } from './controllers/get-delivery-id.controller';
import { AssignDeliveryController } from './controllers/assign-delivery.controller';
import { UpdateDeliveryStatusController } from './controllers/update-delivery-status.controller';
import { UpdatePositionController } from './controllers/update-position.controller';

/**
 * Module Delivery.
 * Gère le suivi des livraisons, l'assignation des livreurs et le tracking GPS.
 */
export class DeliveryModule {
    public readonly getAllController: GetDeliveryAllController;
    public readonly getByIdController: GetDeliveryByIdController;
    public readonly assignController: AssignDeliveryController;
    public readonly updateStatusController: UpdateDeliveryStatusController;
    public readonly updatePositionController: UpdatePositionController;

    constructor(db: PostgresDatabase, logger: Logger) {
        // 1. Repository
        const deliveryRepository = new DeliveryRepository(db, logger);

        // 2. Services
        const getAllService = new GetDeliveryAllService(deliveryRepository, logger);
        const getByIdService = new GetDeliveryByIdService(deliveryRepository, logger);
        const assignService = new AssignDeliveryService(deliveryRepository, logger);
        const updateStatusService = new UpdateDeliveryStatusService(deliveryRepository, logger);
        const updatePositionService = new UpdatePositionService(deliveryRepository, logger);

        // 3. Contrôleurs
        this.getAllController = new GetDeliveryAllController(getAllService);
        this.getByIdController = new GetDeliveryByIdController(getByIdService);
        this.assignController = new AssignDeliveryController(assignService);
        this.updateStatusController = new UpdateDeliveryStatusController(updateStatusService);
        this.updatePositionController = new UpdatePositionController(updatePositionService);
    }
}
