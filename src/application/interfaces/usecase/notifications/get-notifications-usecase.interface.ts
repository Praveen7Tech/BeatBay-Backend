import { NotificationResponse } from "../../../dto/notifications/send.notification.dto";

export interface INotificationsUsecase{
    execute(userId: string): Promise<NotificationResponse[]>
}