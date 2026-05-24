import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { LogoutService } from '../../services/logout.service';
import { AuthRepository } from '../../repositories/auth.repositories';

describe('LogoutService', () => {
    let logoutService: LogoutService;
    let authRepositoryMock: jest.Mocked<AuthRepository>;
    let loggerMock: any;

    beforeEach(() => {
        authRepositoryMock = {
            deleteSession: jest.fn(),
            deleteSessionsByAuthId: jest.fn(),
        } as any;

        loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
        };

        logoutService = new LogoutService(authRepositoryMock, loggerMock);
    });

    it('should logout by token', async () => {
        await logoutService.logout('some-token');
        expect(authRepositoryMock.deleteSession).toHaveBeenCalledWith('some-token');
    });

    it('should logout from all devices', async () => {
        await logoutService.logoutFromAllDevices('user-id');
        expect(authRepositoryMock.deleteSessionsByAuthId).toHaveBeenCalledWith('user-id');
    });
});
