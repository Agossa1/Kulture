import { StockRepository } from "../repositories/media.repositories";
import type { Logger } from 'winston';
import { Stock } from "../types/stock.types";
import { NotFoundError } from "../../../shared/errors/appErrors";

export class GetStockByIdService {
    constructor(
        private readonly stockRepository: StockRepository,
        private readonly logger: Logger
    ) {}

    public async getById(id: string): Promise<Stock> {
        try {
            const stock = await this.stockRepository.findById(id);
            if (!stock) {
                throw new NotFoundError(`Stock avec l'ID ${id} non trouvé`);
            }
            return stock;
        } catch (error) {
            this.logger.error(`Error in GetStockByIdService for id ${id}:`, error);
            throw error;
        }
    }
}
