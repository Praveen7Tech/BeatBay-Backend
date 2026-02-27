import { Types } from "mongoose";
import { IPayoutHistoryRepository, Last12MonthsRevenueItem } from "../../../../domain/repositories/payoutHistory.repository";
import { PayoutHistoryModel } from "../models/payout.history.model";
import { payoutHistory } from "../../../../domain/entities/payoutHistory.entity";
import { ArtistModel } from "../models/artist.model";
import { AdminPayoutPaginationDTO, TopArtistDTO } from "../../../../application/dto/admin/revenue/revenue-dashboard.dto";

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

    async getTopArtistsByRevenue(limit = 5): Promise<TopArtistDTO[]> {
        const result = await PayoutHistoryModel.aggregate([
        { $match: { status: "completed" } },
        {
            $group: {
            _id: "$artistId",
            revenue: { $sum: "$amount" },
            streams: { $sum: "$totalPlaysInPeriod" }
            }
        },
        { $sort: { revenue: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: ArtistModel.collection.name, 
                localField: "_id",
                foreignField: "_id",
                as: "artist"
            }
        },

        { $unwind: "$artist" },
        {
            $project: {
            _id: 0,
            artistId: { $toString: "$_id" },
            revenue: {
            $round: [
                { $divide: ["$revenue", 100] },
                2
            ]
            },
            streams: 1,
            name: "$artist.name",
            profilePicture: "$artist.profilePicture"
            }
        }
        ]);

        return result.map((r, index) => ({
        ...r,
        rank: index + 1
        })) as TopArtistDTO[];
    }

    async getPayoutHistory(page: number,limit: number): Promise<AdminPayoutPaginationDTO> {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            PayoutHistoryModel.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                from: ArtistModel.collection.name,
                localField: "artistId",
                foreignField: "_id",
                as: "artist"
                }
            },
            { $unwind: "$artist" },
            {
                $project: {
                _id: 0,
                id: { $toString: "$stripeTransferId" },
                artist: "$artist.name",
                amount: { $divide: ["$amount", 100] },
                status: "$status",
                method: "Stripe",
                date: {
                    $dateToString: {
                        format: "%b %d, %Y",
                        date: "$createdAt"
                    }
                }
                }
            }
            ]),

            PayoutHistoryModel.countDocuments()
        ]);

        return {
            items: data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
        }

}