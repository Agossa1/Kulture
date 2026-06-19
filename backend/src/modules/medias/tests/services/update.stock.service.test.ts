import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdateStockService } from '../../services/update.stock.service';
import { StockRepository } from '../../repositories/stock.repositories';

describe('UpdateStockService', () => {
    let updateService: UpdateStockService;
    let stockRepositoryMock: jest.Mocked<StockRepository>;
    let loggerMock: any;

    const mockStock = {
        id: 'stock-123',
        quantity: 150,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        stockRepositoryMock = {
            update: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        updateService = new UpdateStockService(stockRepositoryMock, loggerMock);
    });

    it('should update stock successfully', async () => {
        stockRepositoryMock.update.mockResolvedValue(mockStock as any);

        const result = await updateService.update('stock-123', { quantity: 150 });

        expect(result).toEqual(mockStock);
        expect(stockRepositoryMock.update).toHaveBeenCalledWith('stock-123', { quantity: 150 });
    });
});
