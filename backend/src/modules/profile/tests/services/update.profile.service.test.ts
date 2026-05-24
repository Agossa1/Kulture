import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdateProfileService } from '../../services/update.profile.service';
import { ProfileRepository } from '../../repositories/profile.repositories';

describe('UpdateProfileService', () => {
    let updateService: UpdateProfileService;
    let profileRepositoryMock: jest.Mocked<ProfileRepository>;
    let loggerMock: any;

    const mockProfile = {
        authId: 'user-123',
        firstName: 'Updated',
        lastName: 'Name'
    };

    beforeEach(() => {
        profileRepositoryMock = {
            updateProfile: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        updateService = new UpdateProfileService(profileRepositoryMock, loggerMock);
    });

    it('should update profile successfully', async () => {
        profileRepositoryMock.updateProfile.mockResolvedValue(mockProfile as any);

        const result = await updateService.update('user-123', { firstName: 'Updated' });

        expect(result).toEqual(mockProfile);
        expect(profileRepositoryMock.updateProfile).toHaveBeenCalledWith('user-123', { firstName: 'Updated' });
    });
});
