// infrastructure/repositories/mongo/songRevenueHistory.repository.ts
import { Types } from "mongoose";
import { SongRevenueHistory } from "../../../../domain/entities/song.revenue.history";
import { ISongRevenueHistoryRepository, SongRevenueHistoryLean } from "../../../../domain/repositories/song.revenue.history.repository";
import { SongRevenueHistoryModel } from "../models/song.revenueHistory.model";

export class SongRevenueHistoryRepository implements ISongRevenueHistoryRepository {

  async createMany(data: SongRevenueHistory[]): Promise<void> {
    await SongRevenueHistoryModel.insertMany(data);
  }

  async getLifetimeRevenue(songId: string): Promise<number> {
    const result = await SongRevenueHistoryModel.aggregate([
      { $match: { songId: new Types.ObjectId(songId) } },
      { $group: { _id: null, total: { $sum: "$revenueAmount" } } }
    ]);
    return result[0]?.total || 0;
  }

  async getLast12MonthsRevenue(songId: string, startDate: Date,endDate: Date): Promise<{ year: number; month: number; total: number }[]> {
    return SongRevenueHistoryModel.aggregate([
      {
        $match: {
          songId: new Types.ObjectId(songId),
          periodStart: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$periodStart" },
            month: { $month: "$periodStart" }
          },
          total: { $sum: "$revenueAmount" }
        }
      },
      {
        $project: {
          year: "$_id.year",
          month: "$_id.month",
          total: 1,
          _id: 0
        }
      },
      {
        $sort: { year: 1, month: 1 }
      }
    ]);
  }

  async getPayoutHistory(songId: string): Promise<{
    payoutId: string;
    revenue: number;
    periodStart: Date;
    periodEnd: Date;
  }[]> {

    const docs = await SongRevenueHistoryModel.find({ songId: new Types.ObjectId(songId) })
      // .populate("payoutId", "_id period amount stripeTransferId")
      .lean<SongRevenueHistoryLean[]>();

    return docs.map(d => ({
      payoutId: typeof d.payoutId === "string" ? d.payoutId : d.payoutId._id.toString(),
      revenue: d.revenueAmount / 100, // convert cents to dollars
      periodStart: d.periodStart,
      periodEnd: d.periodEnd
    }));
  }
}
