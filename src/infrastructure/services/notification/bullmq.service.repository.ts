import { Queue } from "bullmq";
import { IJobQueueService } from "../../../domain/services/notification/job-queue.service";
import { queueConnection } from "../../config/redis-queue.config";
import logger from "../../utils/logger/logger";

export class BullMqJobService implements IJobQueueService{

    private notificationQueue = new Queue("fan_notifications",{
        connection: queueConnection
    })

    async addNotificationJob(artistId: string, message: string): Promise<void> {
        await this.notificationQueue.add("send_to_fans",{artistId, message})
        logger.info("notification job assign to BullMq/redis complete")
    }
}