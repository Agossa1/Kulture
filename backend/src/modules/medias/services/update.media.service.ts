import { StockRepository } from "../repositories/media.repositories";
import type { Logger } from 'winston';
import { Stock, UpdateStockDTO } from "../types/stock.types";

export class UpdateStockService {
    constructor(
        private readonly stockRepository: StockRepository,
        private readonly logger: Logger
    ) {}

    public async update(id: string, dto: UpdateStockDTO): Promise<Stock> {
        try {
            const updatedStock = await this.stockRepository.update(id, dto);
            this.logger.info(`Stock mis à jour : ${id}`);
            return updatedStock;
        } catch (error) {
            this.logger.error(`Error in UpdateStockService for id ${id}:`, error);
            throw error;
        }
    }
}
