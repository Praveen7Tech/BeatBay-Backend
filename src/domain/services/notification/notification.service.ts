import { Notification } from "../../entities/notification.entity";

export interface INotificationService{
    create(data: Partial<Notification>): Promise<Notification>
}