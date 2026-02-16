
export interface IJobQueueService{
    addNotificationJob(artistId: string, message: string): Promise<void>
}