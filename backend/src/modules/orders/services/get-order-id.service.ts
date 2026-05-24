import { OrderRepository } from "../repositories/order.repositories";
import type { Logger } from 'winston';
import { Order } from "../types/order.types";
import { NotFoundError } from "../../../shared/errors/appErrors";

export class GetOrderByIdService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly logger: Logger
    ) {}

    public async getById(id: string): Promise<Order> {
        try {
            const order = await this.orderRepository.findById(id);
            if (!order) throw new NotFoundError(`Commande avec l'ID ${id} non trouvée`);
            return order;
        } catch (error) {
            this.logger.error(`Error in GetOrderByIdService for id ${id}:`, error);
            throw error;
        }
    }
}
