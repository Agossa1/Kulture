import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { VerifyService } from '../../services/verify.service';
import { AuthRepository } from '../../repositories/auth.repositories';
import { AuthMailer } from '../../../../utils/mailer/authMailer';
import { UnauthorizedError } from '../../../../shared/errors/appErrors';

describe('VerifyService', () => {
    let verifyService: VerifyService;
    let authRepositoryMock: jest.Mocked<AuthRepository>;
    let loggerMock: any;
    let authMailerMock: jest.Mocked<AuthMailer>;

    beforeEach(() => {
        authRepositoryMock = {
            verifyUserAccount: jest.fn(),
        } as any;

        loggerMock = {
            warn: jest.fn(),
            info: jest.fn(),
            error: jest.fn(),
        };

        authMailerMock = {
            sendWelcomeEmail: jest.fn(),
        } as any;

        verifyService = new VerifyService(
            authRepositoryMock,
            loggerMock,
            authMailerMock
        );
    });

    it('should verify account successfully', async () => {
        authRepositoryMock.verifyUserAccount.mockResolvedValue({
            email: 'test@example.com',
            firstName: 'John'
        });

        await verifyService.verifyAccount('user-id', '123456');

        expect(authRepositoryMock.verifyUserAccount).toHaveBeenCalledWith('user-id', '123456');
        expect(authMailerMock.sendWelcomeEmail).toHaveBeenCalledWith('test@example.com', 'John');
        expect(loggerMock.info).toHaveBeenCalled();
    });

    it('should throw UnauthorizedError if code is invalid', async () => {
        authRepositoryMock.verifyUserAccount.mockResolvedValue(null);

        await expect(verifyService.verifyAccount('user-id', 'wrong-code'))
            .rejects.toThrow(UnauthorizedError);
        expect(loggerMock.warn).toHaveBeenCalled();
    });
});
