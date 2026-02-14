import { IDeleteAllNotificationsUseCase } from "../../../application/interfaces/usecase/notifications/delete-all-notifications-usecase.interface";
import { INotificationService } from "../../../domain/services/notification/notification.service";

export class DeleteAllNotificationsUseCase implements IDeleteAllNotificationsUseCase{
    constructor(
        private readonly _notificationService: INotificationService
    ){}

    async execute(userId: string): Promise<boolean> {
        
        await this._notificationService.delteAll(userId)

        return true
    }
}