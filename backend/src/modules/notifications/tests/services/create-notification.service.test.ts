import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateNotificationService } from '../../services/create-notification.service';
import { NotificationRepository } from '../../repositories/notification.repositories';

describe('CreateNotificationService', () => {
    let createService: CreateNotificationService;
    let notificationRepositoryMock: jest.Mocked<NotificationRepository>;
    let loggerMock: any;

    const mockNotification = {
        id: 'notif-123',
        authId: 'user-123',
        title: 'Titre',
        body: 'Message',
        isRead: false,
        createdAt: new Date()
    };

    beforeEach(() => {
        notificationRepositoryMock = {
            create: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        createService = new CreateNotificationService(notificationRepositoryMock, loggerMock);
    });

    it('should create a notification successfully', async () => {
        notificationRepositoryMock.create.mockResolvedValue(mockNotification);

        const dto = {
            authId: 'user-123',
            title: 'Titre',
            body: 'Message'
        };

        const result = await createService.create(dto);

        expect(result).toEqual(mockNotification);
        expect(notificationRepositoryMock.create).toHaveBeenCalledWith(dto);
    });
});
