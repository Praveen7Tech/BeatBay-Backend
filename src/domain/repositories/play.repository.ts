import { ObjectId } from "mongoose";
import { SongPerformanceResult } from "../../application/dto/artist/song/song.performance.dto";

export interface MonthlyPlayStatus{
    totalPlays: number;
    artistShares:{
        artistId: string
        count: number
    }[]
}

export interface IPlayRepository{
    recentPlay(userId:string, songId: string, date:Date): Promise<boolean>;
    create(userId:string, songId: string, artistId: string, date:Date): Promise<void>;
    getMonthlyStatus(startDate: Date, endDate: Date): Promise<MonthlyPlayStatus | null>;
    getArtistPlayCount(artistId: string, start: Date, end: Date): Promise<number>;
    getTotalPlatformPlays(start: Date, end: Date): Promise<number>;
    getSongWisePlays(artistId: string, start: Date, end: Date): Promise<{ songId: string, count: number }[]>
    getSongPerformance( songId: string, from: Date,to: Date,format: "%Y-%m-%d" | "%Y-%m"): Promise<SongPerformanceResult[]>;
}