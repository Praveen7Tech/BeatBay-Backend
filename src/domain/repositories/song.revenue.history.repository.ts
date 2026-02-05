
import { Types } from "mongoose";
import { SongRevenueHistory } from "../entities/song.revenue.history";

// Lean type after populate
export type SongRevenueHistoryLean = {
  payoutId: { _id: Types.ObjectId } | string; // could be populated object or string
  revenueAmount: number;
  periodStart: Date;
  periodEnd: Date;
};

export interface ISongRevenueHistoryRepository {
  createMany(data: SongRevenueHistory[]): Promise<void>;
  getLifetimeRevenue(songId: string): Promise<number>;
  getYearlyRevenue(songId: string, year: number): Promise<{ month: number; total: number }[]>;
  getPayoutHistory(songId: string): Promise<{
    payoutId: string;
    revenue: number;
    periodStart: Date;
    periodEnd: Date;
  }[]>;
}
