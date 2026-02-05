import { payoutHistory } from "../entities/payoutHistory.entity"

export interface IPayoutHistoryRepository{
    historyExist(artistId: string, month: number, year: number): Promise<boolean>
    create(data: Partial<payoutHistory>): Promise<payoutHistory>;
    getLifetimeEarnings(artistId: string): Promise<number>;
    getYearlyHistory(artistId: string): Promise<{ month: number; year: number; amount: number }[]>;
    getAllPayouts(artistId: string): Promise<any[]>
}