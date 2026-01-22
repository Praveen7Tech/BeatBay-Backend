import { ArtistDashboardResponseDTO } from "../../../../dto/artist/dashboard/artist.dashboard.dto";

export interface IArtistDashBoardDataUseCase{
    execute(artistId:string): Promise<ArtistDashboardResponseDTO>
}