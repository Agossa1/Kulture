import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DeleteStockService } from '../../services/delete.stock.service';
import { StockRepository } from '../../repositories/stock.repositories';

describe('DeleteStockService', () => {
    let deleteService: DeleteStockService;
    let stockRepositoryMock: jest.Mocked<StockRepository>;
    let loggerMock: any;

    beforeEach(() => {
        stockRepositoryMock = {
            delete: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        deleteService = new DeleteStockService(stockRepositoryMock, loggerMock);
    });

    it('should delete stock successfully', async () => {
        stockRepositoryMock.delete.mockResolvedValue(undefined);

        await deleteService.delete('stock-123');

        expect(stockRepositoryMock.delete).toHaveBeenCalledWith('stock-123');
    });
});
