import { OrderRepository } from "../repositories/order.repositories";
import type { Logger } from 'winston';
import { Order, UpdateOrderStatusDTO } from "../types/order.types";

export class UpdateOrderStatusService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly logger: Logger
    ) {}

    public async updateStatus(id: string, dto: UpdateOrderStatusDTO): Promise<Order> {
        try {
            const updatedOrder = await this.orderRepository.updateStatus(id, dto);
            this.logger.info(`Commande ${id} : statut mis à jour → ${dto.status}`);
            return updatedOrder;
        } catch (error) {
            this.logger.error(`Error in UpdateOrderStatusService for id ${id}:`, error);
            throw error;
        }
    }
}
