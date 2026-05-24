import { OrderRepository } from "../repositories/order.repositories";
import type { Logger } from 'winston';
import { Order, CreateOrderDTO } from "../types/order.types";

export class CreateOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly logger: Logger
    ) {}

    public async create(dto: CreateOrderDTO): Promise<Order> {
        try {
            const newOrder = await this.orderRepository.create(dto);
            this.logger.info(`Nouvelle commande créée (ID: ${newOrder.id}, Total: ${newOrder.totalAmount})`);
            return newOrder;
        } catch (error) {
            this.logger.error('Error in CreateOrderService:', error);
            throw error;
        }
    }
}
