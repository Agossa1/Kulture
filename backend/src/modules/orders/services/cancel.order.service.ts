import { OrderRepository } from "../repositories/order.repositories";
import type { Logger } from 'winston';
import { Order } from "../types/order.types";

export class CancelOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly logger: Logger
    ) {}

    public async cancel(id: string, reason?: string): Promise<Order> {
        try {
            const cancelled = await this.orderRepository.cancel(id, reason);
            this.logger.info(`Commande ${id} annulée`);
            return cancelled;
        } catch (error) {
            this.logger.error(`Error in CancelOrderService for id ${id}:`, error);
            throw error;
        }
    }
}
