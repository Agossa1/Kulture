import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PreferencesService } from '../../services/preferences.service';
import { AuthRepository } from '../../repositories/auth.repositories';

describe('PreferencesService', () => {
    let preferencesService: PreferencesService;
    let authRepositoryMock: jest.Mocked<AuthRepository>;
    let loggerMock: any;

    const mockPrefs = {
        id: 'pref-id',
        authId: 'user-id',
        language: 'fr',
        theme: 'dark',
        notificationsEnabled: true
    };

    beforeEach(() => {
        authRepositoryMock = {
            getUserPreferences: jest.fn(),
            updateUserPreferences: jest.fn(),
        } as any;

        loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
        };

        preferencesService = new PreferencesService(authRepositoryMock, loggerMock);
    });

    it('should get preferences', async () => {
        authRepositoryMock.getUserPreferences.mockResolvedValue(mockPrefs);

        const result = await preferencesService.getPreferences('user-id');

        expect(result).toEqual(mockPrefs);
    });

    it('should create default preferences if none exist', async () => {
        authRepositoryMock.getUserPreferences.mockResolvedValue(null);
        authRepositoryMock.updateUserPreferences.mockResolvedValue(mockPrefs);

        const result = await preferencesService.getPreferences('user-id');

        expect(authRepositoryMock.updateUserPreferences).toHaveBeenCalledWith('user-id', expect.objectContaining({
            language: 'fr'
        }));
        expect(result).toEqual(mockPrefs);
    });

    it('should update preferences', async () => {
        authRepositoryMock.updateUserPreferences.mockResolvedValue(mockPrefs);

        const result = await preferencesService.updatePreferences('user-id', { theme: 'dark' });

        expect(authRepositoryMock.updateUserPreferences).toHaveBeenCalledWith('user-id', { theme: 'dark' });
        expect(result).toEqual(mockPrefs);
    });
});
