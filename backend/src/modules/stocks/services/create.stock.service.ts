import { StockRepository } from "../repositories/stock.repositories";
import type { Logger } from 'winston';
import { Stock, CreateStockDTO } from "../types/stock.types";

export class CreateStockService {
    constructor(
        private readonly stockRepository: StockRepository,
        private readonly logger: Logger
    ) {}

    public async create(dto: CreateStockDTO): Promise<Stock> {
        try {
            const newStock = await this.stockRepository.create(dto);
            this.logger.info(`Nouveau lot de stock créé (Lot: ${newStock.batchNumber}, ID: ${newStock.id})`);
            return newStock;
        } catch (error) {
            this.logger.error('Error in CreateStockService:', error);
            throw error;
        }
    }
}
