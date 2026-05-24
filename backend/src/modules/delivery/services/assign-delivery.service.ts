import { DeliveryRepository } from "../repositories/delivery.repositories";
import type { Logger } from 'winston';
import { Delivery, AssignDeliveryDTO } from "../types/delivery.types";

export class AssignDeliveryService {
    constructor(
        private readonly deliveryRepository: DeliveryRepository,
        private readonly logger: Logger
    ) {}

    public async assign(dto: AssignDeliveryDTO): Promise<Delivery> {
        try {
            const updated = await this.deliveryRepository.assignDelivery(dto);
            this.logger.info(`Livreur ${dto.deliveryPersonId} assigné à la livraison ${dto.deliveryId}`);
            return updated;
        } catch (error) {
            this.logger.error('Error in AssignDeliveryService:', error);
            throw error;
        }
    }
}
