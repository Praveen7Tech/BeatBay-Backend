import { ArtistGrowthChartDTO } from "../../../../dto/artist/dashboard/artist.dashboard.dto";

export interface IArtistGrowthAnalyticsUseCase{
    execute(artistId: string, days: number): Promise<ArtistGrowthChartDTO[]>
}