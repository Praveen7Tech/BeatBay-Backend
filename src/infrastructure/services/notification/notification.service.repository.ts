import { Notification } from "../../../domain/entities/notification.entity";
import { INotificationService } from "../../../domain/services/notification/notification.service";
import { NotificationModel } from "../../presistence/mongoose/models/notification.model";

export class NotificationService implements INotificationService{

    async create(data: Partial<Notification>): Promise<Notification> {
        const noti = await NotificationModel.create(data)
        return noti.toObject()
    }
}