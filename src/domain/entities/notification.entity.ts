export type NotifyType = "INVITE" | "REJECT" | "JOINED" | "REMOVE"

export interface Notification{
    _id: string
    recipientId:string;
    senderId: string
    type:NotifyType
    roomId: string
    message:string
    isRead: boolean
    cretedAt: Date
}