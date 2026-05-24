import { DeliveryRepository } from "../repositories/delivery.repositories";
import type { Logger } from 'winston';
import { Delivery, UpdateDeliveryStatusDTO } from "../types/delivery.types";

export class UpdateDeliveryStatusService {
    constructor(
        private readonly deliveryRepository: DeliveryRepository,
        private readonly logger: Logger
    ) {}

    public async updateStatus(id: string, dto: UpdateDeliveryStatusDTO): Promise<Delivery> {
        try {
            const updated = await this.deliveryRepository.updateStatus(id, dto);
            this.logger.info(`Statut de livraison ${id} mis à jour : ${dto.status}`);
            return updated;
        } catch (error) {
            this.logger.error(`Error in UpdateDeliveryStatusService for id ${id}:`, error);
            throw error;
        }
    }
}
