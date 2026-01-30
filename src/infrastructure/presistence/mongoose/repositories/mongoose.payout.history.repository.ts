import { IPayoutHistoryRepository } from "../../../../domain/repositories/payoutHistory.repository";
import { PayoutHistoryModel } from "../models/payout.history.model";

export class PayoutHistoryRepository implements IPayoutHistoryRepository{

    async historyExist(artistId: string, month: number, year: number): Promise<boolean> {
        const count = await PayoutHistoryModel.countDocuments({
            artistId,
            'period.month': month,
            'perid.year': year,
            status: 'completed'
        })

        return count > 0
    }

    async create(data: any): Promise<void> {
        await PayoutHistoryModel.create(data)
    }

}