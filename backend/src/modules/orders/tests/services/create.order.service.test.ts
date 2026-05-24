import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateOrderService } from '../../services/create.order.service';
import { OrderRepository } from '../../repositories/order.repositories';

describe('CreateOrderService', () => {
    let createService: CreateOrderService;
    let orderRepositoryMock: jest.Mocked<OrderRepository>;
    let loggerMock: any;

    const mockOrder = {
        id: 'order-123',
        authId: 'user-123',
        pharmacyId: 'pharmacy-123',
        totalAmount: 50.0,
        status: 'pending' as any,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        orderRepositoryMock = {
            create: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        createService = new CreateOrderService(orderRepositoryMock, loggerMock);
    });

    it('should create an order successfully', async () => {
        orderRepositoryMock.create.mockResolvedValue(mockOrder);

        const dto = {
            authId: 'user-123',
            pharmacyId: 'pharmacy-123',
            items: [{ medicineId: 'med-123', quantity: 2, unitPrice: 25.0 }]
        };

        const result = await createService.create(dto as any);

        expect(result).toEqual(mockOrder);
        expect(orderRepositoryMock.create).toHaveBeenCalledWith(dto);
    });
});
