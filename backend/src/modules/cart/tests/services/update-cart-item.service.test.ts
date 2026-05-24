import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdateCartItemService } from '../../services/update-cart-item.service';
import { CartRepository } from '../../repositories/cart.repositories';

describe('UpdateCartItemService', () => {
    let updateService: UpdateCartItemService;
    let cartRepositoryMock: jest.Mocked<CartRepository>;
    let loggerMock: any;

    beforeEach(() => {
        cartRepositoryMock = {
            updateItemQuantity: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        updateService = new UpdateCartItemService(cartRepositoryMock, loggerMock);
    });

    it('should update item quantity successfully', async () => {
        cartRepositoryMock.updateItemQuantity.mockResolvedValue(undefined);

        await updateService.update('item-123', 5);

        expect(cartRepositoryMock.updateItemQuantity).toHaveBeenCalledWith('item-123', 5);
    });
});
