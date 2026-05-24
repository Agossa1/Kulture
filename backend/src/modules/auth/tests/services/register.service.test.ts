import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RegisterService } from '../../services/register.service';
import { AuthRepository } from '../../repositories/auth.repositories';
import { AuthMailer } from '../../../../utils/mailer/authMailer';
import { PasswordService } from '../../../../config/passwords/passwordServices';
import { ConflictError } from '../../../../shared/errors/appErrors';
import { Role } from '../../types/auth.types';

describe('RegisterService', () => {
    let registerService: RegisterService;
    let authRepositoryMock: jest.Mocked<AuthRepository>;
    let loggerMock: any;
    let authMailerMock: jest.Mocked<AuthMailer>;
    let passwordServiceMock: jest.Mocked<PasswordService>;

    const mockDto = {
        id: 'user-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        phone: '1234567890',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockCredentials = {
        id: 'cre-id',
        authId: 'user-id',
        passwordHash: 'password123',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockStatus = {
        id: 'status-id',
        authId: 'user-id',
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        authRepositoryMock = {
            getUserByEmail: jest.fn(),
            getUserByPhone: jest.fn(),
            createUser: jest.fn(),
            createOtp: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        authMailerMock = {
            sendVerificationCode: jest.fn(),
        } as any;

        passwordServiceMock = {
            hashPassword: jest.fn(),
        } as any;

        registerService = new RegisterService(
            authRepositoryMock,
            loggerMock,
            authMailerMock,
            passwordServiceMock
        );
    });

    it('should register a new user successfully', async () => {
        authRepositoryMock.getUserByEmail.mockResolvedValue(null);
        authRepositoryMock.getUserByPhone.mockResolvedValue(null);
        passwordServiceMock.hashPassword.mockResolvedValue('hashed-password');
        authRepositoryMock.createUser.mockResolvedValue({ ...mockDto, credentials: mockCredentials, accountStatus: mockStatus } as any);

        const result = await registerService.registerUser(mockDto, mockCredentials, mockStatus);

        expect(result.email).toBe(mockDto.email.toLowerCase());
        expect(authRepositoryMock.createUser).toHaveBeenCalled();
        expect(authRepositoryMock.createOtp).toHaveBeenCalled();
        expect(authMailerMock.sendVerificationCode).toHaveBeenCalled();
    });

    it('should throw ConflictError if email is already in use', async () => {
        authRepositoryMock.getUserByEmail.mockResolvedValue(mockDto as any);

        await expect(registerService.registerUser(mockDto, mockCredentials, mockStatus))
            .rejects.toThrow(ConflictError);
    });

    it('should throw ConflictError if phone is already in use', async () => {
        authRepositoryMock.getUserByEmail.mockResolvedValue(null);
        authRepositoryMock.getUserByPhone.mockResolvedValue(mockDto as any);

        await expect(registerService.registerUser(mockDto, mockCredentials, mockStatus))
            .rejects.toThrow(ConflictError);
    });
});
