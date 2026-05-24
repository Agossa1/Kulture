import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetNotificationsService } from '../../services/get-notifications.service';
import { NotificationRepository } from '../../repositories/notification.repositories';

describe('GetNotificationsService', () => {
    let getService: GetNotificationsService;
    let notificationRepositoryMock: jest.Mocked<NotificationRepository>;
    let loggerMock: any;

    const mockNotifications = [
        { id: '1', title: 'N1' },
        { id: '2', title: 'N2' }
    ];

    beforeEach(() => {
        notificationRepositoryMock = {
            findAll: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        getService = new GetNotificationsService(notificationRepositoryMock, loggerMock);
    });

    it('should return notifications for a user', async () => {
        notificationRepositoryMock.findAll.mockResolvedValue({ notifications: mockNotifications as any, total: 2 });

        const result = await getService.getNotifications('user-123');

        expect(result.notifications).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(notificationRepositoryMock.findAll).toHaveBeenCalledWith('user-123', 20, 0);
    });

    it('should handle pagination', async () => {
        notificationRepositoryMock.findAll.mockResolvedValue({ notifications: mockNotifications as any, total: 2 });

        await getService.getNotifications('user-123', 2, 10);

        expect(notificationRepositoryMock.findAll).toHaveBeenCalledWith('user-123', 10, 10);
    });
});
