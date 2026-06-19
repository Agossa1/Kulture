import { StockRepository } from "../repositories/media.repositories";
import type { Logger } from 'winston';
import { Stock, AlertType } from "../types/stock.types";

export class GetStockAllService {
    constructor(
        private readonly stockRepository: StockRepository,
        private readonly logger: Logger
    ) {}

    public async getAll(filters: {
        pharmacyId?: string;
        medicineId?: string;
        alertLevel?: AlertType;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{ stocks: Stock[], total: number }> {
        try {
            const limit = filters.limit || 20;
            const offset = ((filters.page || 1) - 1) * limit;

            return await this.stockRepository.findAll({
                ...filters,
                limit,
                offset
            });
        } catch (error) {
            this.logger.error('Error in GetStockAllService:', error);
            throw error;
        }
    }
}
