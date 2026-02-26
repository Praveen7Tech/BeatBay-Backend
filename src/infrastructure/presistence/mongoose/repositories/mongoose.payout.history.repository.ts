import { Types } from "mongoose";
import { IPayoutHistoryRepository, Last12MonthsRevenueItem } from "../../../../domain/repositories/payoutHistory.repository";
import { PayoutHistoryModel } from "../models/payout.history.model";
import { payoutHistory } from "../../../../domain/entities/payoutHistory.entity";

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

    async create(data: any): Promise<payoutHistory> {
        const payout = await PayoutHistoryModel.create(data)
        return payout.toObject()
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

    async getLast12MonthsHistory( artistId: string): Promise<Last12MonthsRevenueItem[]> {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return await PayoutHistoryModel.aggregate([
            {
                $match: {
                    artistId: new Types.ObjectId(artistId),
                    createdAt: { $gte: start, $lte: end },
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                    },
                    amount: { $sum: "$amount" },
                    totalPlaysInPeriod: { $sum: "$totalPlaysInPeriod" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);
    }

    async getAllPayouts(artistId: string): Promise<any[]> {
        return await PayoutHistoryModel.find({ 
            artistId: new Types.ObjectId(artistId) 
        }).sort({ createdAt: -1 }); 
    }

}