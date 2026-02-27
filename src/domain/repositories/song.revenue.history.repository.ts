
import { Types } from "mongoose";
import { SongRevenueHistory } from "../entities/song.revenue.history";
import { TopSongDTO } from "../../application/dto/admin/revenue/revenue-dashboard.dto";

// Lean type after populate
export type SongRevenueHistoryLean = {
  payoutId: { _id: Types.ObjectId } | string; // could be populated object or string
  revenueAmount: number;
  periodStart: Date;
  periodEnd: Date;
};

export interface ISongRevenueHistoryRepository {
  createMany(data: SongRevenueHistory[]): Promise<void>;
  getLast12MonthsRevenue(songId: string, startDate: Date,endDate: Date): Promise<{ year: number; month: number; total: number }[]>
  getLifetimeRevenue(songId: string): Promise<number>;
  getPayoutHistory(songId: string): Promise<{
    payoutId: string;
    revenue: number;
    periodStart: Date;
    periodEnd: Date;
  }[]>;
  getTopSongsByRevenue(limit?: number): Promise<TopSongDTO[]>
}
