import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdatePreferencesService } from '../../services/update.preferences.service';
import { ProfileRepository } from '../../repositories/profile.repositories';

describe('UpdatePreferencesService', () => {
    let updateService: UpdatePreferencesService;
    let profileRepositoryMock: jest.Mocked<ProfileRepository>;
    let loggerMock: any;

    const mockPrefs = {
        authId: 'user-123',
        language: 'fr',
        notificationsEnabled: true
    };

    beforeEach(() => {
        profileRepositoryMock = {
            upsertPreferences: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        updateService = new UpdatePreferencesService(profileRepositoryMock, loggerMock);
    });

    it('should update preferences successfully', async () => {
        profileRepositoryMock.upsertPreferences.mockResolvedValue(mockPrefs as any);

        const result = await updateService.update('user-123', { language: 'fr' });

        expect(result).toEqual(mockPrefs);
        expect(profileRepositoryMock.upsertPreferences).toHaveBeenCalledWith('user-123', { language: 'fr' });
    });
});
