export type NotifyType = "INVITE" | "REJECT" | "JOINED" | "REMOVE" | "SONG_UPLOAD"

export interface Notification{
    _id: string
    recipientId:string;
    senderId: string
    senderName: string
    senderImage: string | null
    type:NotifyType
    roomId: string
    message:string
    isRead: boolean
    cretedAt: Date
}