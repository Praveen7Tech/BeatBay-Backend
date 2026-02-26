import { payoutHistory } from "../entities/payoutHistory.entity"

export interface Last12MonthsRevenueItem {
  _id: {
    year: number;
    month: number;
  };
  amount: number;
  totalPlaysInPeriod: number;
}

export interface IPayoutHistoryRepository{
    historyExist(artistId: string, month: number, year: number): Promise<boolean>
    create(data: Partial<payoutHistory>): Promise<payoutHistory>;
    getLifetimeEarnings(artistId: string): Promise<number>;
    getLast12MonthsHistory(artistId: string): Promise<Last12MonthsRevenueItem[]>;
    getAllPayouts(artistId: string): Promise<any[]>
}