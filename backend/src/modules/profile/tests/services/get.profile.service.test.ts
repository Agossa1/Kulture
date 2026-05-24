import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetProfileService } from '../../services/get.profile.service';
import { ProfileRepository } from '../../repositories/profile.repositories';
import { NotFoundError } from '../../../../shared/errors/appErrors';

describe('GetProfileService', () => {
    let getService: GetProfileService;
    let profileRepositoryMock: jest.Mocked<ProfileRepository>;
    let loggerMock: any;

    const mockProfile = {
        authId: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        profileRepositoryMock = {
            findById: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        getService = new GetProfileService(profileRepositoryMock, loggerMock);
    });

    it('should return profile if found', async () => {
        profileRepositoryMock.findById.mockResolvedValue(mockProfile as any);

        const result = await getService.getProfile('user-123');

        expect(result).toEqual(mockProfile);
        expect(profileRepositoryMock.findById).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundError if profile is not found', async () => {
        profileRepositoryMock.findById.mockResolvedValue(null);

        await expect(getService.getProfile('unknown'))
            .rejects.toThrow(NotFoundError);
    });
});
