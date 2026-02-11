import { Notification } from "../../entities/notification.entity";

export interface INotificationService{
    create(data: Notification): Promise<void>
}