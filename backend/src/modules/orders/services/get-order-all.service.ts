import { OrderRepository } from "../repositories/order.repositories";
import type { Logger } from 'winston';
import { Order, OrderStatus, DeliveryMode } from "../types/order.types";

export class GetOrderAllService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly logger: Logger
    ) {}

    public async getAll(filters: {
        authId?: string;
        pharmacyId?: string;
        status?: OrderStatus;
        deliveryMode?: DeliveryMode;
        page?: number;
        limit?: number;
    }): Promise<{ orders: Order[], total: number }> {
        try {
            const limit = filters.limit || 20;
            const offset = ((filters.page || 1) - 1) * limit;
            return await this.orderRepository.findAll({ ...filters, limit, offset });
        } catch (error) {
            this.logger.error('Error in GetOrderAllService:', error);
            throw error;
        }
    }
}
