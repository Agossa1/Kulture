import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AddAddressService } from '../../services/add.address.service';
import { ProfileRepository } from '../../repositories/profile.repositories';

describe('AddAddressService', () => {
    let addService: AddAddressService;
    let profileRepositoryMock: jest.Mocked<ProfileRepository>;
    let loggerMock: any;

    const mockAddress = {
        id: 'addr-123',
        label: 'Home',
        street: '123 Main St'
    };

    beforeEach(() => {
        profileRepositoryMock = {
            addAddress: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        addService = new AddAddressService(profileRepositoryMock, loggerMock);
    });

    it('should add address successfully', async () => {
        profileRepositoryMock.addAddress.mockResolvedValue(mockAddress as any);

        const result = await addService.add('user-123', { label: 'Home', street: '123 Main St' } as any);

        expect(result).toEqual(mockAddress);
        expect(profileRepositoryMock.addAddress).toHaveBeenCalledWith('user-123', { label: 'Home', street: '123 Main St' });
    });
});
