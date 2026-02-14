import { NotFound } from "@aws-sdk/client-s3";
import { NotificationResponse, NotificationSendData } from "../../../application/dto/notifications/send.notification.dto";
import { ISendNotificationsUseCase } from "../../../application/interfaces/usecase/notifications/send-notifications-usecase.interface";
import { NotificationMapper } from "../../../application/mappers/user/notifications/user.notification.mapper";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { INotificationService } from "../../../domain/services/notification/notification.service";
import { NotFoundError } from "../../../common/errors/common/common.errors";

export class SendNotificationUseCase implements ISendNotificationsUseCase {
    constructor(
        private readonly _notificationService: INotificationService,
        private readonly _userRepository: IUserRepository
    ){}

    async execute(data: NotificationSendData): Promise<NotificationResponse> {

        const sender = await this._userRepository.findById(data.senderId)
        if(!sender) throw new NotFoundError("sender not found")
        
        let message = "";
        switch (data.type){
            case "INVITE" :{
                message = `${sender.name} invited you in a room`;
                break
            }
            case "JOINED" :{
                message = `${sender.name} joined the room.`
                break;
            }
            case "REJECT" :{
                message = `${sender.name} declined your invitation.`
                break;
            }
            case "REMOVE" :{
                message = `You were removed from the room by hsot ${sender.name} !`
                break;
            }
        }


        const notify = await this._notificationService.create({
            recipientId: data.recipientId,
            senderId: data.senderId,
            senderName: sender.name,
            senderImage: sender.profilePicture,
            roomId: data.roomId,
            message,
            type: data.type,
            isRead: false,
        })

        const notificationData = NotificationMapper.toResponse(notify,sender.name)

        return notificationData
    }
}