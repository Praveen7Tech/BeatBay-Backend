import { response } from "express";
import { Notification } from "../../../../domain/entities/notification.entity";
import { NotificationResponse } from "../../../dto/notifications/send.notification.dto";


export class NotificationMapper{
     static toResponse(notifi: Notification, senderName: string): NotificationResponse{
        return {
            id: notifi._id,
            senderName,
            senderImage: notifi.senderImage || "",
            message:notifi.message,
            type: notifi.type,
            isRead: false,
            time: notifi.cretedAt
        }
     }

     static toNotificationResponse(notify: Notification[]): NotificationResponse[]{
        return notify.map(not => this.toResponse(not, not?.senderName))
     }
}