import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RefreshTokenService } from '../../services/refreshtoken.service';
import { AuthRepository } from '../../repositories/auth.repositories';
import { TokenManager } from '../../../../config/tokens/tokenManager';
import { UnauthorizedError } from '../../../../shared/errors/appErrors';
import { Role } from '../../types/auth.types';

describe('RefreshTokenService', () => {
    let refreshTokenService: RefreshTokenService;
    let authRepositoryMock: jest.Mocked<AuthRepository>;
    let loggerMock: any;
    let tokenManagerMock: jest.Mocked<TokenManager>;

    const mockSession = {
        auth_id: 'user-id',
        token: 'refresh-token'
    };

    const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: Role.USER,
        roles: [Role.USER],
        accountStatus: { isVerified: true }
    };

    beforeEach(() => {
        authRepositoryMock = {
            getSessionByToken: jest.fn(),
            getUserWithCredentialsByIdentifier: jest.fn(),
            deleteSession: jest.fn(),
            createSession: jest.fn(),
            updateLastLogin: jest.fn(),
        } as any;

        loggerMock = {
            warn: jest.fn(),
            error: jest.fn(),
        };

        tokenManagerMock = {
            verifyRefreshToken: jest.fn(),
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
        } as any;

        refreshTokenService = new RefreshTokenService(
            authRepositoryMock,
            loggerMock,
            tokenManagerMock
        );
    });

    it('should refresh token successfully', async () => {
        authRepositoryMock.getSessionByToken.mockResolvedValue(mockSession);
        tokenManagerMock.verifyRefreshToken.mockReturnValue({ id: 'user-id' });
        authRepositoryMock.getUserWithCredentialsByIdentifier.mockResolvedValue(mockUser as any);
        tokenManagerMock.generateAccessToken.mockReturnValue('new-access-token');
        tokenManagerMock.generateRefreshToken.mockReturnValue('new-refresh-token');

        const result = await refreshTokenService.refresh('refresh-token');

        expect(result.accessToken).toBe('new-access-token');
        expect(authRepositoryMock.deleteSession).toHaveBeenCalledWith('refresh-token');
        expect(authRepositoryMock.createSession).toHaveBeenCalled();
        expect(authRepositoryMock.updateLastLogin).toHaveBeenCalled();
    });

    it('should throw UnauthorizedError if session is not found', async () => {
        authRepositoryMock.getSessionByToken.mockResolvedValue(null);

        await expect(refreshTokenService.refresh('invalid-token'))
            .rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if token verification fails', async () => {
        authRepositoryMock.getSessionByToken.mockResolvedValue(mockSession);
        tokenManagerMock.verifyRefreshToken.mockReturnValue(null);

        await expect(refreshTokenService.refresh('refresh-token'))
            .rejects.toThrow(UnauthorizedError);
    });
});
