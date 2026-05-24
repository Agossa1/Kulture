import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ClearCartService } from '../../services/clear-cart.service';
import { CartRepository } from '../../repositories/cart.repositories';

describe('ClearCartService', () => {
    let clearService: ClearCartService;
    let cartRepositoryMock: jest.Mocked<CartRepository>;
    let loggerMock: any;

    beforeEach(() => {
        cartRepositoryMock = {
            clearCart: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        clearService = new ClearCartService(cartRepositoryMock, loggerMock);
    });

    it('should clear cart successfully', async () => {
        cartRepositoryMock.clearCart.mockResolvedValue(undefined);

        await clearService.clear('cart-123');

        expect(cartRepositoryMock.clearCart).toHaveBeenCalledWith('cart-123');
    });
});
