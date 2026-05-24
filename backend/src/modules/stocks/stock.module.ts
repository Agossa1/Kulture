import PostgresDatabase from '../../infra/database/postgres';
import type { Logger } from 'winston';
import { StockRepository } from './repositories/stock.repositories';

import { GetStockAllService } from './services/get-stock-all.service';
import { GetStockByIdService } from './services/get-stock-id.service';
import { CreateStockService } from './services/create.stock.service';
import { UpdateStockService } from './services/update.stock.service';
import { DeleteStockService } from './services/delete.stock.service';

import { GetStockAllController } from './controllers/get-stock-all.controller';
import { GetStockByIdController } from './controllers/get-stock-id.controller';
import { CreateStockController } from './controllers/create.stock.controller';
import { UpdateStockController } from './controllers/update.stock.controller';
import { DeleteStockController } from './controllers/delete.stock.controller';

/**
 * Module Stocks.
 * Centralise l'injection de dépendances pour le domaine de gestion des stocks.
 */
export class StockModule {
    public readonly getAllController: GetStockAllController;
    public readonly getByIdController: GetStockByIdController;
    public readonly createController: CreateStockController;
    public readonly updateController: UpdateStockController;
    public readonly deleteController: DeleteStockController;

    constructor(db: PostgresDatabase, logger: Logger) {
        // 1. Repository
        const stockRepository = new StockRepository(db, logger);

        // 2. Services
        const getAllService = new GetStockAllService(stockRepository, logger);
        const getByIdService = new GetStockByIdService(stockRepository, logger);
        const createService = new CreateStockService(stockRepository, logger);
        const updateService = new UpdateStockService(stockRepository, logger);
        const deleteService = new DeleteStockService(stockRepository, logger);

        // 3. Contrôleurs
        this.getAllController = new GetStockAllController(getAllService);
        this.getByIdController = new GetStockByIdController(getByIdService);
        this.createController = new CreateStockController(createService);
        this.updateController = new UpdateStockController(updateService);
        this.deleteController = new DeleteStockController(deleteService);
    }
}
