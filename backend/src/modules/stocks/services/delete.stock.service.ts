import { StockRepository } from "../repositories/stock.repositories";
import type { Logger } from 'winston';

export class DeleteStockService {
    constructor(
        private readonly stockRepository: StockRepository,
        private readonly logger: Logger
    ) {}

    public async delete(id: string): Promise<void> {
        try {
            await this.stockRepository.delete(id);
            this.logger.info(`Stock supprimé avec succès : ${id}`);
        } catch (error) {
            this.logger.error(`Error in DeleteStockService for id ${id}:`, error);
            throw error;
        }
    }
}
