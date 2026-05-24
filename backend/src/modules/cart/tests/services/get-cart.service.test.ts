import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetCartService } from '../../services/get-cart.service';
import { CartRepository } from '../../repositories/cart.repositories';

describe('GetCartService', () => {
    let getService: GetCartService;
    let cartRepositoryMock: jest.Mocked<CartRepository>;
    let loggerMock: any;

    const mockCart = {
        id: 'cart-123',
        authId: 'user-123',
        pharmacyId: 'pharm-1',
        items: []
    };

    beforeEach(() => {
        cartRepositoryMock = {
            findCart: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
        };

        getService = new GetCartService(cartRepositoryMock, loggerMock);
    });

    it('should return cart if found', async () => {
        cartRepositoryMock.findCart.mockResolvedValue(mockCart as any);

        const result = await getService.getCart('user-123', 'pharm-1');

        expect(result).toEqual(mockCart);
        expect(cartRepositoryMock.findCart).toHaveBeenCalledWith('user-123', 'pharm-1');
    });

    it('should return null if cart not found', async () => {
        cartRepositoryMock.findCart.mockResolvedValue(null);

        const result = await getService.getCart('user-123', 'pharm-1');

        expect(result).toBeNull();
    });
});
