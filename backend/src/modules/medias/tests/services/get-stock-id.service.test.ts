import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetStockByIdService } from '../../services/get-stock-id.service';
import { StockRepository } from '../../repositories/stock.repositories';
import { NotFoundError } from '../../../../shared/errors/appErrors';

describe('GetStockByIdService', () => {
    let getService: GetStockByIdService;
    let stockRepositoryMock: jest.Mocked<StockRepository>;
    let loggerMock: any;

    const mockStock = {
        id: 'stock-123',
        pharmacyId: 'pharmacy-123',
        medicineId: 'medicine-123',
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        stockRepositoryMock = {
            findById: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        getService = new GetStockByIdService(stockRepositoryMock, loggerMock);
    });

    it('should return stock if found', async () => {
        stockRepositoryMock.findById.mockResolvedValue(mockStock as any);

        const result = await getService.getById('stock-123');

        expect(result).toEqual(mockStock);
        expect(stockRepositoryMock.findById).toHaveBeenCalledWith('stock-123');
    });

    it('should throw NotFoundError if stock is not found', async () => {
        stockRepositoryMock.findById.mockResolvedValue(null);

        await expect(getService.getById('unknown'))
            .rejects.toThrow(NotFoundError);
    });
});
