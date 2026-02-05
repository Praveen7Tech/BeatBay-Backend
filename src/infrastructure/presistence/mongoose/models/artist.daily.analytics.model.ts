import mongoose, { HydratedDocument, Model, Schema, model } from "mongoose";
import { ArtistDailyAnalytics } from "../../../../domain/entities/artist.daily.analytics.entity";

export type ArtistAnalyticsDocument = HydratedDocument<ArtistDailyAnalytics>

const ArtistDailyAnalyticsSchema = new Schema({
  artistId: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  date: { type: String, required: true },

  fans: { type: Number, default: 0 },
  streams: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  songs: { type: Number, default: 0 },
  albums: { type: Number, default: 0 },

}, { timestamps: true });

ArtistDailyAnalyticsSchema.index({ artistId: 1, date: 1 }, { unique: true });

export const ArtistDailyAnalyticsModel: Model<ArtistAnalyticsDocument> = mongoose.model<ArtistAnalyticsDocument>("ArtistAnalytics", ArtistDailyAnalyticsSchema)