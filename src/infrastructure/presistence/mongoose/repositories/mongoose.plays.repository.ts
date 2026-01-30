import { count } from "console";
import { IPlayRepository, MonthlyPlayStatus } from "../../../../domain/repositories/play.repository";
import { PlayModel } from "../models/play.model";

export class SongPlayRepository implements IPlayRepository{

    async recentPlay(userId: string, songId: string, date: Date): Promise<boolean> {
        
        const play = await PlayModel.findOne({
            userId,
            songId,
            playedAt: {$gte: {date}}
        })

        return !!play
    }

    async create(userId: string, songId: string, artistId: string, date: Date): Promise<void> {
        
        await PlayModel.create({
            userId,
            songId,
            artistId,
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
}