import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetDeliveryAllService } from '../../services/get-delivery-all.service';
import { DeliveryRepository } from '../../repositories/delivery.repositories';

describe('GetDeliveryAllService', () => {
    let getAllService: GetDeliveryAllService;
    let deliveryRepositoryMock: jest.Mocked<DeliveryRepository>;
    let loggerMock: any;

    const mockDeliveries = [
        { id: '1', status: 'pending' },
        { id: '2', status: 'delivered' }
    ];

    beforeEach(() => {
        deliveryRepositoryMock = {
            findAll: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        getAllService = new GetDeliveryAllService(deliveryRepositoryMock, loggerMock);
    });

    it('should return all deliveries with default pagination', async () => {
        deliveryRepositoryMock.findAll.mockResolvedValue({ deliveries: mockDeliveries as any, total: 2 });

        const result = await getAllService.getAll({});

        expect(result.deliveries).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(deliveryRepositoryMock.findAll).toHaveBeenCalledWith(expect.objectContaining({
            limit: 20,
            offset: 0
        }));
    });

    it('should apply filters and pagination', async () => {
        deliveryRepositoryMock.findAll.mockResolvedValue({ deliveries: mockDeliveries as any, total: 2 });

        await getAllService.getAll({ page: 2, limit: 10, status: 'delivered' as any });

        expect(deliveryRepositoryMock.findAll).toHaveBeenCalledWith(expect.objectContaining({
            limit: 10,
            offset: 10,
            status: 'delivered'
        }));
    });
});
