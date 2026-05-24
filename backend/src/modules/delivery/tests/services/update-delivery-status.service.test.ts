import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdateDeliveryStatusService } from '../../services/update-delivery-status.service';
import { DeliveryRepository } from '../../repositories/delivery.repositories';

describe('UpdateDeliveryStatusService', () => {
    let updateService: UpdateDeliveryStatusService;
    let deliveryRepositoryMock: jest.Mocked<DeliveryRepository>;
    let loggerMock: any;

    const mockDelivery = {
        id: 'delivery-123',
        status: 'delivered' as any,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        deliveryRepositoryMock = {
            updateStatus: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        updateService = new UpdateDeliveryStatusService(deliveryRepositoryMock, loggerMock);
    });

    it('should update delivery status successfully', async () => {
        deliveryRepositoryMock.updateStatus.mockResolvedValue(mockDelivery as any);

        const result = await updateService.updateStatus('delivery-123', { status: 'delivered' as any });

        expect(result).toEqual(mockDelivery);
        expect(deliveryRepositoryMock.updateStatus).toHaveBeenCalledWith('delivery-123', { status: 'delivered' });
    });
});
