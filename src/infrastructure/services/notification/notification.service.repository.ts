import { Notification } from "../../../domain/entities/notification.entity";
import { INotificationService } from "../../../domain/services/notification/notification.service";
import { NotificationModel } from "../../presistence/mongoose/models/notification.model";

export class NotificationService implements INotificationService{

    async create(data: Notification): Promise<void> {
        const noti = new NotificationModel(data)
        await noti.save()
    }
}