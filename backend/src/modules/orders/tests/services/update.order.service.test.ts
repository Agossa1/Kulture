import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdateOrderStatusService } from '../../services/update.order.service';
import { OrderRepository } from '../../repositories/order.repositories';

describe('UpdateOrderStatusService', () => {
    let updateService: UpdateOrderStatusService;
    let orderRepositoryMock: jest.Mocked<OrderRepository>;
    let loggerMock: any;

    const mockOrder = {
        id: 'order-123',
        status: 'validated' as any,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        orderRepositoryMock = {
            updateStatus: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        updateService = new UpdateOrderStatusService(orderRepositoryMock, loggerMock);
    });

    it('should update order status successfully', async () => {
        orderRepositoryMock.updateStatus.mockResolvedValue(mockOrder as any);

        const result = await updateService.updateStatus('order-123', { status: 'validated' as any });

        expect(result).toEqual(mockOrder);
        expect(orderRepositoryMock.updateStatus).toHaveBeenCalledWith('order-123', { status: 'validated' });
    });
});
