
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
    getMonthlyStatus(startDate: Date, endDate: Date): Promise<MonthlyPlayStatus | null>
}