import { DeliveryRepository } from "../repositories/delivery.repositories";
import type { Logger } from 'winston';
import { UpdatePositionDTO } from "../types/delivery.types";

export class UpdatePositionService {
    constructor(
        private readonly deliveryRepository: DeliveryRepository,
        private readonly logger: Logger
    ) {}

    public async updatePosition(dto: UpdatePositionDTO): Promise<void> {
        try {
            await this.deliveryRepository.updatePosition(dto);
            // On ne loggue pas systématiquement chaque position pour éviter de flooder les logs de prod
        } catch (error) {
            this.logger.error('Error in UpdatePositionService:', error);
            throw error;
        }
    }
}
