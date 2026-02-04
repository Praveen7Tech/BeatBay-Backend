import { IArtistRevenueDashboard } from "../../../../dto/artist/revenue/revenue.dashboard.dto";

export interface IArtistRevenueUseCase{
    execute(artistId: string): Promise<IArtistRevenueDashboard>
}