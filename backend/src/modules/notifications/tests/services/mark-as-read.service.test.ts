import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { MarkAsReadService } from '../../services/mark-as-read.service';
import { NotificationRepository } from '../../repositories/notification.repositories';

describe('MarkAsReadService', () => {
    let markAsReadService: MarkAsReadService;
    let notificationRepositoryMock: jest.Mocked<NotificationRepository>;
    let loggerMock: any;

    beforeEach(() => {
        notificationRepositoryMock = {
            markAsRead: jest.fn(),
            markAllAsRead: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        markAsReadService = new MarkAsReadService(notificationRepositoryMock, loggerMock);
    });

    it('should mark a notification as read successfully', async () => {
        notificationRepositoryMock.markAsRead.mockResolvedValue(undefined);

        await markAsReadService.markAsRead('notif-123');

        expect(notificationRepositoryMock.markAsRead).toHaveBeenCalledWith('notif-123');
    });

    it('should mark all notifications as read successfully', async () => {
        notificationRepositoryMock.markAllAsRead.mockResolvedValue(undefined);

        await markAsReadService.markAllAsRead('user-123');

        expect(notificationRepositoryMock.markAllAsRead).toHaveBeenCalledWith('user-123');
    });
});
