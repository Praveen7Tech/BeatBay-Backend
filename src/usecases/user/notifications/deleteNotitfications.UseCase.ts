import { IDeleteNotificationUseCase } from "../../../application/interfaces/usecase/notifications/delete-notification-usecase.interface";
import { INotificationService } from "../../../domain/services/notification/notification.service";
import logger from "../../../infrastructure/utils/logger/logger";

export class DeleteNotificationUseCase implements IDeleteNotificationUseCase{
    constructor(
        private readonly _notificationService: INotificationService
    ){}

    async execute(userId: string, notificationId: string): Promise<boolean> {
        
        await this._notificationService.deleteNotification(userId, notificationId)
        logger.info("notification deleted successfully.")
        return true
    }
}