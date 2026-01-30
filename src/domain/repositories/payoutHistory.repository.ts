import { payoutHistory } from "../entities/payoutHistory.entity"

export interface IPayoutHistoryRepository{
    historyExist(artistId: string, month: number, year: number): Promise<boolean>
    create(data: Partial<payoutHistory>): Promise<void>
}