import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetStockAllService } from '../../services/get-stock-all.service';
import { StockRepository } from '../../repositories/stock.repositories';

describe('GetStockAllService', () => {
    let getAllService: GetStockAllService;
    let stockRepositoryMock: jest.Mocked<StockRepository>;
    let loggerMock: any;

    const mockStocks = [
        { id: '1', quantity: 10 },
        { id: '2', quantity: 20 }
    ];

    beforeEach(() => {
        stockRepositoryMock = {
            findAll: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        getAllService = new GetStockAllService(stockRepositoryMock, loggerMock);
    });

    it('should return all stocks with default pagination', async () => {
        stockRepositoryMock.findAll.mockResolvedValue({ stocks: mockStocks as any, total: 2 });

        const result = await getAllService.getAll({});

        expect(result.stocks).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(stockRepositoryMock.findAll).toHaveBeenCalledWith(expect.objectContaining({
            limit: 20,
            offset: 0
        }));
    });

    it('should apply filters and pagination', async () => {
        stockRepositoryMock.findAll.mockResolvedValue({ stocks: mockStocks as any, total: 2 });

        await getAllService.getAll({ page: 2, limit: 10, pharmacyId: 'pharm-1' });

        expect(stockRepositoryMock.findAll).toHaveBeenCalledWith(expect.objectContaining({
            limit: 10,
            offset: 10,
            pharmacyId: 'pharm-1'
        }));
    });
});
