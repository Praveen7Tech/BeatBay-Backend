import { SongRevenueDashboardResponseDTO } from "../../../../dto/artist/revenue/song.revenue.history.dto";

export interface ISongRevenueHistoryUseCase{
    execute(songId:string, year: number): Promise<SongRevenueDashboardResponseDTO>
}