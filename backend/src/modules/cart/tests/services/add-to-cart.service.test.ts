import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AddToCartService } from '../../services/add-to-cart.service';
import { CartRepository } from '../../repositories/cart.repositories';

describe('AddToCartService', () => {
    let addToCartService: AddToCartService;
    let cartRepositoryMock: jest.Mocked<CartRepository>;
    let loggerMock: any;

    const mockCart = {
        id: 'cart-123',
        authId: 'user-123',
        pharmacyId: 'pharmacy-123',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        cartRepositoryMock = {
            addItem: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        addToCartService = new AddToCartService(cartRepositoryMock, loggerMock);
    });

    it('should add item to cart successfully', async () => {
        cartRepositoryMock.addItem.mockResolvedValue(mockCart as any);

        const dto = {
            authId: 'user-123',
            pharmacyId: 'pharmacy-123',
            medicineId: 'med-123',
            quantity: 2
        };

        const result = await addToCartService.add(dto);

        expect(result).toEqual(mockCart);
        expect(cartRepositoryMock.addItem).toHaveBeenCalledWith(dto);
    });
});
