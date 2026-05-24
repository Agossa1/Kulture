import { DeliveryRepository } from "../repositories/delivery.repositories";
import type { Logger } from 'winston';
import { Delivery, DeliveryStatus } from "../types/delivery.types";

export class GetDeliveryAllService {
    constructor(
        private readonly deliveryRepository: DeliveryRepository,
        private readonly logger: Logger
    ) {}

    public async getAll(filters: {
        status?: DeliveryStatus;
        deliveryPersonId?: string;
        page?: number;
        limit?: number;
    }): Promise<{ deliveries: Delivery[], total: number }> {
        try {
            const limit = filters.limit || 20;
            const offset = ((filters.page || 1) - 1) * limit;
            return await this.deliveryRepository.findAll({ ...filters, limit, offset });
        } catch (error) {
            this.logger.error('Error in GetDeliveryAllService:', error);
            throw error;
        }
    }
}
