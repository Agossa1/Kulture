import { DeliveryRepository } from "../repositories/delivery.repositories";
import type { Logger } from 'winston';
import { Delivery } from "../types/delivery.types";
import { NotFoundError } from "../../../shared/errors/appErrors";

export class GetDeliveryByIdService {
    constructor(
        private readonly deliveryRepository: DeliveryRepository,
        private readonly logger: Logger
    ) {}

    public async getById(id: string): Promise<Delivery> {
        try {
            const delivery = await this.deliveryRepository.findById(id);
            if (!delivery) throw new NotFoundError(`Livraison avec l'ID ${id} non trouvée`);
            return delivery;
        } catch (error) {
            this.logger.error(`Error in GetDeliveryByIdService for id ${id}:`, error);
            throw error;
        }
    }
}
