import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AssignDeliveryService } from '../../services/assign-delivery.service';
import { DeliveryRepository } from '../../repositories/delivery.repositories';

describe('AssignDeliveryService', () => {
    let assignService: AssignDeliveryService;
    let deliveryRepositoryMock: jest.Mocked<DeliveryRepository>;
    let loggerMock: any;

    const mockDelivery = {
        id: 'delivery-123',
        orderId: 'order-123',
        status: 'assigned' as any,
        deliveryPersonId: 'person-123',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        deliveryRepositoryMock = {
            assignDelivery: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        assignService = new AssignDeliveryService(deliveryRepositoryMock, loggerMock);
    });

    it('should assign a delivery successfully', async () => {
        deliveryRepositoryMock.assignDelivery.mockResolvedValue(mockDelivery as any);

        const dto = {
            deliveryId: 'delivery-123',
            deliveryPersonId: 'person-123'
        };

        const result = await assignService.assign(dto);

        expect(result).toEqual(mockDelivery);
        expect(deliveryRepositoryMock.assignDelivery).toHaveBeenCalledWith(dto);
    });
});
