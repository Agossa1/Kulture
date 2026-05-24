import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetDeliveryByIdService } from '../../services/get-delivery-id.service';
import { DeliveryRepository } from '../../repositories/delivery.repositories';
import { NotFoundError } from '../../../../shared/errors/appErrors';

describe('GetDeliveryByIdService', () => {
    let getService: GetDeliveryByIdService;
    let deliveryRepositoryMock: jest.Mocked<DeliveryRepository>;
    let loggerMock: any;

    const mockDelivery = {
        id: 'delivery-123',
        orderId: 'order-123',
        status: 'pending' as any,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        deliveryRepositoryMock = {
            findById: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        getService = new GetDeliveryByIdService(deliveryRepositoryMock, loggerMock);
    });

    it('should return delivery if found', async () => {
        deliveryRepositoryMock.findById.mockResolvedValue(mockDelivery as any);

        const result = await getService.getById('delivery-123');

        expect(result).toEqual(mockDelivery);
        expect(deliveryRepositoryMock.findById).toHaveBeenCalledWith('delivery-123');
    });

    it('should throw NotFoundError if delivery is not found', async () => {
        deliveryRepositoryMock.findById.mockResolvedValue(null);

        await expect(getService.getById('unknown'))
            .rejects.toThrow(NotFoundError);
    });
});
