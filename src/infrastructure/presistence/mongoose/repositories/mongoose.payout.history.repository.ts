import { Types } from "mongoose";
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


    async getLifetimeEarnings(artistId: string): Promise<number> {
        const result = await PayoutHistoryModel.aggregate([
            { $match: { 
                artistId: new Types.ObjectId(artistId), 
                status: 'completed' 
            }},
            { $group: { 
                _id: null, 
                total: { $sum: "$amount" } 
            }}
        ]);

        return result.length > 0 ? result[0].total : 0;
    }

    async getYearlyHistory(artistId: string): Promise<{ month: number; year: number; amount: number }[]> {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        return await PayoutHistoryModel.aggregate([
            { $match: { 
                artistId: new Types.ObjectId(artistId),
                status: 'completed',
                createdAt: { $gte: twelveMonthsAgo }
            }},
            { $group: { 
                _id: { 
                    month: "$period.month", 
                    year: "$period.year" 
                }, 
                amount: { $sum: "$amount" } 
            }},
            { $project: { 
                _id: 0, 
                month: "$_id.month", 
                year: "$_id.year", 
                amount: 1 
            }},
            { $sort: { year: 1, month: 1 } }
        ]);
    }

    async getAllPayouts(artistId: string): Promise<any[]> {
        return await PayoutHistoryModel.find({ 
            artistId: new Types.ObjectId(artistId) 
        }).sort({ createdAt: -1 }); 
    }

}