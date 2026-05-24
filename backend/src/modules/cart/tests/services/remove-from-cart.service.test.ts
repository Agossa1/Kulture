import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RemoveFromCartService } from '../../services/remove-from-cart.service';
import { CartRepository } from '../../repositories/cart.repositories';

describe('RemoveFromCartService', () => {
    let removeService: RemoveFromCartService;
    let cartRepositoryMock: jest.Mocked<CartRepository>;
    let loggerMock: any;

    beforeEach(() => {
        cartRepositoryMock = {
            removeItem: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        removeService = new RemoveFromCartService(cartRepositoryMock, loggerMock);
    });

    it('should remove item from cart successfully', async () => {
        cartRepositoryMock.removeItem.mockResolvedValue(undefined);

        await removeService.remove('item-123');

        expect(cartRepositoryMock.removeItem).toHaveBeenCalledWith('item-123');
    });
});
