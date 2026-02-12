import { NotifyType } from "../../../domain/entities/notification.entity";

export interface NotificationSendData{
    recipientId:string;
    senderId: string
    senderName: string
    type:NotifyType
    roomId: string
}