import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { LoginService } from '../../services/login.service';
import { AuthRepository } from '../../repositories/auth.repositories';
import { PasswordService } from '../../../../config/passwords/passwordServices';
import { TokenManager } from '../../../../config/tokens/tokenManager';
import { UnauthorizedError, ForbiddenError } from '../../../../shared/errors/appErrors';
import { Role } from '../../types/auth.types';

describe('LoginService', () => {
    let loginService: LoginService;
    let authRepositoryMock: jest.Mocked<AuthRepository>;
    let loggerMock: any;
    let passwordServiceMock: jest.Mocked<PasswordService>;
    let tokenManagerMock: jest.Mocked<TokenManager>;

    const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123456789',
        role: Role.USER,
        accountStatus: { isVerified: true, isActive: true },
        credentials: { passwordHash: 'hashed-password' },
        roles: [Role.USER]
    };

    beforeEach(() => {
        authRepositoryMock = {
            getUserWithCredentialsByIdentifier: jest.fn(),
            createSession: jest.fn(),
            updateLastLogin: jest.fn(),
        } as any;

        loggerMock = {
            warn: jest.fn(),
            info: jest.fn(),
            error: jest.fn(),
        };

        passwordServiceMock = {
            comparePassword: jest.fn(),
        } as any;

        tokenManagerMock = {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
        } as any;

        loginService = new LoginService(
            authRepositoryMock,
            loggerMock,
            passwordServiceMock,
            tokenManagerMock
        );
    });

    it('should login successfully with valid credentials', async () => {
        authRepositoryMock.getUserWithCredentialsByIdentifier.mockResolvedValue(mockUser as any);
        passwordServiceMock.comparePassword.mockResolvedValue(true);
        tokenManagerMock.generateAccessToken.mockReturnValue('access-token');
        tokenManagerMock.generateRefreshToken.mockReturnValue('refresh-token');

        const result = await loginService.login('test@example.com', 'password123');

        expect(result.accessToken).toBe('access-token');
        expect(result.refreshToken).toBe('refresh-token');
        expect(result.user.email).toBe(mockUser.email);
        expect(authRepositoryMock.createSession).toHaveBeenCalled();
        expect(authRepositoryMock.updateLastLogin).toHaveBeenCalled();
    });

    it('should throw UnauthorizedError if user is not found', async () => {
        authRepositoryMock.getUserWithCredentialsByIdentifier.mockResolvedValue(null);

        await expect(loginService.login('unknown@example.com', 'password'))
            .rejects.toThrow(UnauthorizedError);
        expect(loggerMock.warn).toHaveBeenCalled();
    });

    it('should throw ForbiddenError if account is not verified', async () => {
        const unverifiedUser = { ...mockUser, accountStatus: { isVerified: false } };
        authRepositoryMock.getUserWithCredentialsByIdentifier.mockResolvedValue(unverifiedUser as any);

        await expect(loginService.login('test@example.com', 'password'))
            .rejects.toThrow(ForbiddenError);
    });

    it('should throw UnauthorizedError if password is incorrect', async () => {
        authRepositoryMock.getUserWithCredentialsByIdentifier.mockResolvedValue(mockUser as any);
        passwordServiceMock.comparePassword.mockResolvedValue(false);

        await expect(loginService.login('test@example.com', 'wrong-password'))
            .rejects.toThrow(UnauthorizedError);
    });
});
