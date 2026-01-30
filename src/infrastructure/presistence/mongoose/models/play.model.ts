import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Play } from "../../../../domain/entities/play.entity";

export type PlayDocument = HydratedDocument<Play>

const PlaySchema = new Schema({
    songId:{
        type: Schema.Types.ObjectId,
        ref: "Song"
    },
    artistId:{
        type: Schema.Types.ObjectId,
        ref: "Artist"
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    playedAt:{
        type: Date,
        default: Date.now
    },
    duration:{
        type: Number
    }
})

PlaySchema.index({artistId: 1, playedAt: -1})
export const PlayModel : Model<PlayDocument> = mongoose.model<PlayDocument>("Play", PlaySchema)