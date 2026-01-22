import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { PlayList } from "../../../../domain/entities/playList.entiy";

export type PlayListDocument = HydratedDocument<PlayList>
export enum Visibility {
    PUBLIC = "public",
    PRIVATE = "private"
}

const PlayListSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: null
    },
    coverImageUrl:{
        type: String,
        default: null
    },
    coverImagePublicId:{
        type: String,
        default: null
    },
    songs: [{
        type: Schema.Types.ObjectId,
        ref: "Song"
    }],
    visibility: {
        type:String,
        enum: Object.values(Visibility),
        default: Visibility.PUBLIC
    }
},{timestamps: true})

export const PlayListModel: Model<PlayListDocument> = mongoose.model<PlayListDocument>('PlayList', PlayListSchema);