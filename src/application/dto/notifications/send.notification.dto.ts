import { NotifyType } from "../../../domain/entities/notification.entity";

export interface NotificationSendData{
    recipientId:string;
    senderId: string
    type:NotifyType
    roomId: string
}

export interface NotificationResponse{
    id: string
    senderName: string
    senderImage: string
    message: string
    type: NotifyType
    isRead: boolean
    time: Date
}