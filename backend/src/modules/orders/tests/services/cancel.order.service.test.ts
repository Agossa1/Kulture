import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CancelOrderService } from '../../services/cancel.order.service';
import { OrderRepository } from '../../repositories/order.repositories';

describe('CancelOrderService', () => {
    let cancelService: CancelOrderService;
    let orderRepositoryMock: jest.Mocked<OrderRepository>;
    let loggerMock: any;

    const mockOrder = {
        id: 'order-123',
        status: 'cancelled' as any,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        orderRepositoryMock = {
            cancel: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        cancelService = new CancelOrderService(orderRepositoryMock, loggerMock);
    });

    it('should cancel order successfully', async () => {
        orderRepositoryMock.cancel.mockResolvedValue(mockOrder as any);

        const result = await cancelService.cancel('order-123', 'Client request');

        expect(result).toEqual(mockOrder);
        expect(orderRepositoryMock.cancel).toHaveBeenCalledWith('order-123', 'Client request');
    });
});
