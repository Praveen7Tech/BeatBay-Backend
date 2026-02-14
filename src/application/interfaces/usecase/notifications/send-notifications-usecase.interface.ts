import { NotificationResponse, NotificationSendData } from "../../../dto/notifications/send.notification.dto";

export interface ISendNotificationsUseCase{
    execute(data:NotificationSendData): Promise<NotificationResponse>
}