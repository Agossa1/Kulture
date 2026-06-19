import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateStockService } from '../../services/create.stock.service';
import { StockRepository } from '../../repositories/stock.repositories';

describe('CreateStockService', () => {
    let createService: CreateStockService;
    let stockRepositoryMock: jest.Mocked<StockRepository>;
    let loggerMock: any;

    const mockStock = {
        id: 'stock-123',
        pharmacyId: 'pharmacy-123',
        medicineId: 'medicine-123',
        batchNumber: 'LOT-2024-001',
        quantity: 100,
        expirationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        stockRepositoryMock = {
            create: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        createService = new CreateStockService(stockRepositoryMock, loggerMock);
    });

    it('should create stock entry successfully', async () => {
        stockRepositoryMock.create.mockResolvedValue(mockStock);

        const dto = {
            pharmacyId: 'pharmacy-123',
            medicineId: 'medicine-123',
            batchNumber: 'LOT-2024-001',
            quantity: 100,
            expirationDate: new Date()
        };

        const result = await createService.create(dto);

        expect(result).toEqual(mockStock);
        expect(stockRepositoryMock.create).toHaveBeenCalledWith(dto);
    });
});
