import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Notification } from "../../../../domain/entities/notification.entity";

export type NotificationDocument = HydratedDocument<Notification>

const notificationSchema = new Schema({
    recipientId: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        enum: ["INVITE", "REJECT", "JOINED", "REMOVE"]
    },
    roomId: {
        type: String
    },
    message:{
        type: String
    },
    isRead:{
        type: Boolean,
        default: false
    },
    cretedAt:{
        type: Date,
        default: Date.now
    }
})

export const NotificationModel : Model<NotificationDocument> = mongoose.model<NotificationDocument>("Notification", notificationSchema)