import mongoose, { Schema, model, Types, HydratedDocument, Model } from "mongoose";
import { SongRevenueHistory } from "../../../../domain/entities/song.revenue.history";

export type SongDocument = HydratedDocument<SongRevenueHistory>;

const songRevenueHistorySchema = new Schema({
  artistId: { type: Types.ObjectId, ref: "Artist", required: true },
  songId: { type: Types.ObjectId, ref: "Song", required: true },

  payoutId: { type: Types.ObjectId, ref: "PayoutHistory", required: true },

  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },

  playCount: { type: Number, required: true },
  revenueAmount: { type: Number, required: true }, // in cents

  createdAt: { type: Date, default: Date.now }
});


export const SongRevenueHistoryModel: Model<SongDocument> = mongoose.model<SongDocument>('SongRevenueHistory', songRevenueHistorySchema);