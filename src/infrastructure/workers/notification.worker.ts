import { Server } from "socket.io";
import { ConnectionOptions, Job, Worker } from "bullmq";
import { IFollowersRepository } from "../../domain/repositories/followers.repository";
import logger from "../utils/logger/logger";
import { INotificationService } from "../../domain/services/notification/notification.service";
import { NotifyType } from "../../domain/entities/notification.entity";
import { IArtistRepository } from "../../domain/repositories/artist.repository";
import { NotFoundError } from "../../common/errors/common/common.errors";

export class NotificationWorker {
    private worker: Worker;
    constructor(
         private readonly _mongoosefollowersRepository: IFollowersRepository,
         private io: Server,
         private queueConnection: ConnectionOptions,
         private readonly _notificationService: INotificationService,
         private readonly _artistRepository: IArtistRepository
    ){
        this.worker = new Worker("fan_notifications", async(job: Job) => {
            const { artistId, message } = job.data; 

            let Notifications = []
            const BATCH_SIZE = 1000;

            const artist = await this._artistRepository.findById(artistId)
            if(!artist) throw new NotFoundError("Artist not found")

            try {
                const stream = this._mongoosefollowersRepository.getFollowersIdsStream(artistId);

                for await (const doc of stream) {
                    this.io.to(doc.followerId.toString()).emit("notification_recieved", {
                        message: message,
                        type: "NEW_SONG",
                        senderId: artistId,
                        createdAt: new Date()
                    });
                    logger.info(`song update notification send to: ${doc.followerId}`)

                    Notifications.push({
                        recipientId: doc.followerId,
                        senderId: artist._id.toString(),
                        senderName: artist.name,
                        senderImage: artist.profilePicture,
                        roomId: artistId,
                        message,
                        type: "SONG_UPLOAD" as NotifyType,
                        isRead: false,
                    })

                    if(Notifications.length >= BATCH_SIZE){
                        await this._notificationService.bulkCreate(Notifications)
                        Notifications = []
                    }
                }

                if(Notifications.length > 0){
                    await this._notificationService.bulkCreate(Notifications)
                }

            } catch (error) {
                console.error("Worker Error:", error);
                throw error; // BullMQ will retry the job automatically
            }
        }, { connection: this.queueConnection });
    }
}