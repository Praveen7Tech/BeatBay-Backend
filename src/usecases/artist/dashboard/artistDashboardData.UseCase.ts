import { ArtistDashboardResponseDTO } from "../../../application/dto/artist/dashboard/artist.dashboard.dto";
import { IArtistDashBoardDataUseCase } from "../../../application/interfaces/usecase/artist/dashboard/artist-dashboard-usecase.interface";
import { IDashBoardRepository } from "../../../domain/repositories/demographics.repository";

export class ArtistDashBoardDataUseCase implements IArtistDashBoardDataUseCase{
    constructor(
        private readonly _dashBoarRepository: IDashBoardRepository
    ){}

    async execute(artistId: string): Promise<ArtistDashboardResponseDTO> {
        
        const totalSongs = await this._dashBoarRepository.countDocuments("artistId",artistId,"songs")
        const totalAlbums = await this._dashBoarRepository.countDocuments("artistId",artistId,"albums")
        const totalFans = await this._dashBoarRepository.countDocuments("targetId",artistId,'followers')

        return {
            totalSongs,
            totalAlbums,
            totalFans
        }
    }
}