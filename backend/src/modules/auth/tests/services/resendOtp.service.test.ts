import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ResendOtpService } from '../../services/resendOtp.service';
import { AuthRepository } from '../../repositories/auth.repositories';
import { AuthMailer } from '../../../../utils/mailer/authMailer';

describe('ResendOtpService', () => {
    let resendOtpService: ResendOtpService;
    let authRepositoryMock: jest.Mocked<AuthRepository>;
    let loggerMock: any;
    let authMailerMock: jest.Mocked<AuthMailer>;

    const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'John',
        accountStatus: { isVerified: false }
    };

    beforeEach(() => {
        authRepositoryMock = {
            getUserWithCredentialsByIdentifier: jest.fn(),
            createOtp: jest.fn(),
        } as any;

        loggerMock = {
            warn: jest.fn(),
            info: jest.fn(),
            error: jest.fn(),
        };

        authMailerMock = {
            sendVerificationCode: jest.fn(),
        } as any;

        resendOtpService = new ResendOtpService(
            authRepositoryMock,
            loggerMock,
            authMailerMock
        );
    });

    it('should resend OTP successfully', async () => {
        authRepositoryMock.getUserWithCredentialsByIdentifier.mockResolvedValue(mockUser as any);

        await resendOtpService.resendOtp('test@example.com');

        expect(authRepositoryMock.createOtp).toHaveBeenCalled();
        expect(authMailerMock.sendVerificationCode).toHaveBeenCalled();
    });

    it('should ignore if user is already verified', async () => {
        const verifiedUser = { ...mockUser, accountStatus: { isVerified: true } };
        authRepositoryMock.getUserWithCredentialsByIdentifier.mockResolvedValue(verifiedUser as any);

        await resendOtpService.resendOtp('test@example.com');

        expect(authRepositoryMock.createOtp).not.toHaveBeenCalled();
    });

    it('should fail silently if user is not found', async () => {
        authRepositoryMock.getUserWithCredentialsByIdentifier.mockResolvedValue(null);

        await resendOtpService.resendOtp('unknown@example.com');

        expect(authRepositoryMock.createOtp).not.toHaveBeenCalled();
        expect(loggerMock.warn).toHaveBeenCalled();
    });
});
