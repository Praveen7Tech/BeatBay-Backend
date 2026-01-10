import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Likes } from "../../../../domain/entities/likes.entity";

export type LikeDocument = HydratedDocument<Likes>

const likeSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  songId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Song', 
    required: true, 
    index: true 
  },
}, { timestamps: true });

likeSchema.index({ userId: 1, songId: 1 }, { unique: true });

export const LikeModel : Model<LikeDocument> = mongoose.model<LikeDocument>("Likes", likeSchema)