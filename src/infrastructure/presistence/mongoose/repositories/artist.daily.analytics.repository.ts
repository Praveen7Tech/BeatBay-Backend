import mongoose from "mongoose";
import { ArtistDailyAnalytics } from "../../../../domain/entities/artist.daily.analytics.entity";
import { IArtistDailyAnalyticsRepository } from "../../../../domain/repositories/artist.daily.analytics.repository";
import { ArtistDailyAnalyticsModel } from "../models/artist.daily.analytics.model";


export class ArtistDailyAnalyticsRepository implements IArtistDailyAnalyticsRepository {

  async incrementField(artistId: string, date: string, field: any, value: number): Promise<void> {
    await ArtistDailyAnalyticsModel.updateOne(
      { artistId, date },
      { $inc: { [field]: value } },
      { upsert: true }
    );
  }

  // async getDailyRange(artistId: string, from: string, to: string):Promise<ArtistDailyAnalytics[]> {
  //   return ArtistDailyAnalyticsModel.find({
  //     artistId,
  //     date: { $gte: from, $lte: to }
  //   }).sort({ date: 1 }).lean();
  // }

  // async getMonthlyRange( artistId: string,from: string, to: string): Promise<ArtistDailyAnalytics[]> {

  //   return ArtistDailyAnalyticsModel.aggregate([
  //     {
  //       $match: {
  //         artistId: new mongoose.Types.ObjectId(artistId),
  //         date: { $gte: from, $lte: to }
  //       }
  //     },
  //     {
  //       $group: {
  //         _id: { $substr: ["$date", 0, 7] }, // YYYY-MM
  //         fans: { $sum: "$fans" },
  //         streams: { $sum: "$streams" },
  //         revenue: { $sum: "$revenue" }
  //       }
  //     },
  //     { $sort: { _id: 1 } },
  //     {
  //       $project: {
  //         _id: 0,
  //         date: "$_id",
  //         fans: 1,
  //         streams: 1,
  //         revenue: 1
  //       }
  //     }
  //   ]);
  // }

  async getRange(artistId: string, from: string, to: string): Promise<ArtistDailyAnalytics[]> {
    return ArtistDailyAnalyticsModel.find({
      artistId,
      date: { $gte: from, $lte: to }
    }).lean();
  }


}
