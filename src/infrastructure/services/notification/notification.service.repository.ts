import { Notification } from "../../../domain/entities/notification.entity";
import { INotificationService } from "../../../domain/services/notification/notification.service";
import { NotificationModel } from "../../presistence/mongoose/models/notification.model";

export class NotificationService implements INotificationService{

    async create(data: Partial<Notification>): Promise<Notification> {
        const noti = await NotificationModel.create(data)
        return noti.toObject()
    }

    async getNotifications(userId: string): Promise<Notification[]> {
        return await NotificationModel.find({recipientId: userId})
        .populate("senderId", "name profilePicture")
        .sort({createdAt: -1})
        .lean()
    }

    async deleteNotification(userId: string, notificationId: string): Promise<void> {
         await NotificationModel.deleteOne({
            _id:notificationId,
            recipientId: userId,
         })
    }

    async delteAll(userId: string): Promise<void> {
        await NotificationModel.deleteMany({recipientId: userId})
    }

    async bulkCreate(notifications: Partial<Notification>[]): Promise<void> {
        await NotificationModel.insertMany(notifications, {ordered: false})
    }
}