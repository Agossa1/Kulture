import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdatePositionService } from '../../services/update-position.service';
import { DeliveryRepository } from '../../repositories/delivery.repositories';

describe('UpdatePositionService', () => {
    let updateService: UpdatePositionService;
    let deliveryRepositoryMock: jest.Mocked<DeliveryRepository>;
    let loggerMock: any;

    beforeEach(() => {
        deliveryRepositoryMock = {
            updatePosition: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        updateService = new UpdatePositionService(deliveryRepositoryMock, loggerMock);
    });

    it('should update position successfully', async () => {
        deliveryRepositoryMock.updatePosition.mockResolvedValue(undefined);

        const dto = {
            deliveryId: 'delivery-123',
            latitude: 48.8566,
            longitude: 2.3522
        };

        await updateService.updatePosition(dto);

        expect(deliveryRepositoryMock.updatePosition).toHaveBeenCalledWith(dto);
    });
});
