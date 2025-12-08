import mongoose, { HydratedDocument, Model, model, Schema } from "mongoose";
import { PlayList } from "../../../../domain/entities/playList.entiy";
import { string } from "zod";

export type PlayListDocument = HydratedDocument<PlayList>

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
    }]
},{timestamps: true})

export const PlayListModel: Model<PlayListDocument> = mongoose.model<PlayListDocument>('PlayList', PlayListSchema);