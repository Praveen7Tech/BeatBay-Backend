import { Notification } from "../../entities/notification.entity";

export interface INotificationService{
    create(data: Partial<Notification>): Promise<Notification>;
    getNotifications(userId: string): Promise<Notification[]>;
    deleteNotification(userId:string, notificationId: string): Promise<void>;
    delteAll(userId: string): Promise<void>
    bulkCreate(notifications: Partial<Notification>[]): Promise<void>
}