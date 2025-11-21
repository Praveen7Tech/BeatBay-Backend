import mongoose, { HydratedDocument, Model, model, Schema } from "mongoose";
import { PlayList } from "../../../../domain/entities/playList.entiy";

export type PlayListDocument = HydratedDocument<PlayList>

const PlayListSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    songs: [{
        type: Schema.Types.ObjectId,
        ref: "Song"
    }]
},{timestamps: true})

export const PlayListModel: Model<PlayListDocument> = mongoose.model<PlayListDocument>('PlayList', PlayListSchema);