import { NotificationResponse } from "../../../application/dto/notifications/send.notification.dto";
import { INotificationsUsecase } from "../../../application/interfaces/usecase/notifications/get-notifications-usecase.interface";
import { NotificationMapper } from "../../../application/mappers/user/notifications/user.notification.mapper";
import { INotificationService } from "../../../domain/services/notification/notification.service";

export class GetNotificationsUseCase implements INotificationsUsecase{
    constructor(
        private readonly _notificationService: INotificationService
    ){}

    async execute(userId: string): Promise<NotificationResponse[]> {
        
        const notify = await this._notificationService.getNotifications(userId)

        return NotificationMapper.toNotificationResponse(notify)
    }
}