import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RemoveAddressService } from '../../services/remove.address.service';
import { ProfileRepository } from '../../repositories/profile.repositories';

describe('RemoveAddressService', () => {
    let removeService: RemoveAddressService;
    let profileRepositoryMock: jest.Mocked<ProfileRepository>;
    let loggerMock: any;

    beforeEach(() => {
        profileRepositoryMock = {
            removeAddress: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        removeService = new RemoveAddressService(profileRepositoryMock, loggerMock);
    });

    it('should remove address successfully', async () => {
        profileRepositoryMock.removeAddress.mockResolvedValue(undefined);

        await removeService.remove('user-123', 'addr-link-123');

        expect(profileRepositoryMock.removeAddress).toHaveBeenCalledWith('user-123', 'addr-link-123');
    });
});
