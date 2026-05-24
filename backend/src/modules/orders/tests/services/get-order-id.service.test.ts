import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetOrderByIdService } from '../../services/get-order-id.service';
import { OrderRepository } from '../../repositories/order.repositories';
import { NotFoundError } from '../../../../shared/errors/appErrors';

describe('GetOrderByIdService', () => {
    let getService: GetOrderByIdService;
    let orderRepositoryMock: jest.Mocked<OrderRepository>;
    let loggerMock: any;

    const mockOrder = {
        id: 'order-123',
        authId: 'user-123',
        status: 'pending' as any,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        orderRepositoryMock = {
            findById: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        getService = new GetOrderByIdService(orderRepositoryMock, loggerMock);
    });

    it('should return order if found', async () => {
        orderRepositoryMock.findById.mockResolvedValue(mockOrder as any);

        const result = await getService.getById('order-123');

        expect(result).toEqual(mockOrder);
        expect(orderRepositoryMock.findById).toHaveBeenCalledWith('order-123');
    });

    it('should throw NotFoundError if order is not found', async () => {
        orderRepositoryMock.findById.mockResolvedValue(null);

        await expect(getService.getById('unknown'))
            .rejects.toThrow(NotFoundError);
    });
});
