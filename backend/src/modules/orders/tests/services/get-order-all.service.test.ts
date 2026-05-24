import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetOrderAllService } from '../../services/get-order-all.service';
import { OrderRepository } from '../../repositories/order.repositories';

describe('GetOrderAllService', () => {
    let getAllService: GetOrderAllService;
    let orderRepositoryMock: jest.Mocked<OrderRepository>;
    let loggerMock: any;

    const mockOrders = [
        { id: '1', status: 'pending' },
        { id: '2', status: 'validated' }
    ];

    beforeEach(() => {
        orderRepositoryMock = {
            findAll: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        getAllService = new GetOrderAllService(orderRepositoryMock, loggerMock);
    });

    it('should return all orders with default pagination', async () => {
        orderRepositoryMock.findAll.mockResolvedValue({ orders: mockOrders as any, total: 2 });

        const result = await getAllService.getAll({});

        expect(result.orders).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(orderRepositoryMock.findAll).toHaveBeenCalledWith(expect.objectContaining({
            limit: 20,
            offset: 0
        }));
    });

    it('should apply filters and pagination', async () => {
        orderRepositoryMock.findAll.mockResolvedValue({ orders: mockOrders as any, total: 2 });

        await getAllService.getAll({ page: 2, limit: 10, status: 'validated' as any });

        expect(orderRepositoryMock.findAll).toHaveBeenCalledWith(expect.objectContaining({
            limit: 10,
            offset: 10,
            status: 'validated'
        }));
    });
});
