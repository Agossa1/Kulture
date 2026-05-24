export interface Notification {
    id: string;
    authId: string;
    title: string;
    body: string;
    isRead: boolean;
    data?: any;
    createdAt: Date;
}

export interface CreateNotificationDTO {
    authId: string;
    title: string;
    body: string;
    data?: any;
}
