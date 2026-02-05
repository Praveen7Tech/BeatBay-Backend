import { IPlayRepository, MonthlyPlayStatus } from "../../../../domain/repositories/play.repository";
import { PlayModel } from "../models/play.model";
import { Types } from "mongoose";
import { SongPerformanceResult } from "../../../../application/dto/artist/song/song.performance.dto";

export class SongPlayRepository implements IPlayRepository{

    async recentPlay(userId: string, songId: string, date: Date): Promise<boolean> {
        
        const play = await PlayModel.findOne({
            userId,
            songId,
            playedAt: {$gte: date}
        })

        return !!play
    }

    async create(userId: string, songId: string, artistId: string, date: Date): Promise<void> {
    
        await PlayModel.create({
            userId: new Types.ObjectId(userId),
            songId: new Types.ObjectId(songId),
            artistId: artistId, 
            playedAt: date
        })
    }

    async getMonthlyStatus(startDate: Date, endDate: Date): Promise<MonthlyPlayStatus | null> {
        
        const statistics = await PlayModel.aggregate([
            {$match : {playedAt: {$gte: startDate, $lte: endDate}}},
            {$group : {_id: "$artistId", count: {$sum: 1}}},
            {$group : {_id: null, 
                totalPlays: {$sum: "$count"},
                artistShares: {$push : { artistId: "$_id", count: "$count"}}
            }}
        ])

        return statistics.length ? statistics[0] : null
    }

     async getArtistPlayCount(artistId: string, start: Date, end: Date): Promise<number> {
        console.log("date ", start, end)
        const count = await PlayModel.countDocuments({
            artistId: new Types.ObjectId(artistId),
            playedAt: { $gte: start, $lte: end }
        });
        return count;
    }

    // 2. Get total plays across the entire platform in a time range
    async getTotalPlatformPlays(start: Date, end: Date): Promise<number> {
        console.log("total play ", start, end)
        const count = await PlayModel.countDocuments({
            playedAt: { $gte: start, $lte: end }
        });
        return count;
    }

     async getSongWisePlays(artistId: string, start: Date, end: Date): Promise<{ songId: string, count: number }[]> {
        return await PlayModel.aggregate([
            { 
                $match: { 
                    artistId: new Types.ObjectId(artistId), 
                    playedAt: { $gte: start, $lte: end } 
                } 
            },
            { 
                $group: { 
                    _id: "$songId", 
                    count: { $sum: 1 } 
                } 
            },
            { 
                $project: { 
                    _id: 0, 
                    songId: { $toString: "$_id" }, 
                    count: 1 
                } 
            }
        ]);
    }

    async getSongPerformance( songId: string,from: Date, to: Date,format: "%Y-%m-%d" | "%Y-%m"): Promise<SongPerformanceResult[]> {

        const result = await PlayModel.aggregate([
            {$match: {
                songId: new Types.ObjectId(songId),
                playedAt: { $gte: from, $lte: to }
            }},
            { $group: {
                _id: {
                $dateToString: { format, date: "$playedAt" }
                },
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]);

        return result.map(r => ({
            label: r._id,
            count: r.count
        }));
    }

}