import { NotificationSendData } from "../../../application/dto/notifications/send.notification.dto";
import { ISendNotificationsUseCase } from "../../../application/interfaces/usecase/notifications/send-notifications-usecase.interface";
import { INotificationService } from "../../../domain/services/notification/notification.service";

export class SendNotificationUseCase implements ISendNotificationsUseCase {
    constructor(
        private readonly _notificationService: INotificationService
    ){}

    async execute(data: NotificationSendData): Promise<string> {
        
        let message = "";
        switch (data.type){
            case "INVITE" :{
                message = `${data.senderName} invited you in a room`;
                break
            }
            case "JOINED" :{
                message = `${data.senderName} joined the room.`
                break;
            }
            case "REJECT" :{
                message = `${data.senderName} declined your invitation.`
                break;
            }
            case "REMOVE" :{
                message = `you were removed from the room by hst!`
                break;
            }
        }

        const notify = await this._notificationService.create({
            recipientId: data.recipientId,
            senderId: data.senderId,
            roomId: data.roomId,
            message,
            type: data.type,
            isRead: false,
        })

        return notify.message
    }
}