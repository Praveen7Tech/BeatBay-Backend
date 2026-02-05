import { ArtistDashboardResponseDTO } from "../../../application/dto/artist/dashboard/artist.dashboard.dto";
import { IArtistDashBoardDataUseCase } from "../../../application/interfaces/usecase/artist/dashboard/artist-dashboard-usecase.interface";
import { ArtistDashboardMapper } from "../../../application/mappers/artist/dashboard/artist.dashboard.mapper";
import { IDashBoardRepository } from "../../../domain/repositories/demographics.repository";
import { IPayoutHistoryRepository } from "../../../domain/repositories/payoutHistory.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";

export class ArtistDashBoardDataUseCase implements IArtistDashBoardDataUseCase{
    constructor(
        private readonly _dashBoarRepository: IDashBoardRepository,
        private readonly _payoutHistoryRepository: IPayoutHistoryRepository,
        private readonly _awsStorageService: IAWSS3StorageService
    ){}

    async execute(artistId: string): Promise<ArtistDashboardResponseDTO> {
        
        const totalSongs = await this._dashBoarRepository.countDocuments("artistId",artistId,"songs")
        const totalAlbums = await this._dashBoarRepository.countDocuments("artistId",artistId,"albums")
        const totalFans = await this._dashBoarRepository.countDocuments("targetId",artistId,'followers')
        const totalRevenue = await this._payoutHistoryRepository.getLifetimeEarnings(artistId)
        //const topSongs = await this._dashBoarRepository.findTopPlayedSongsByArtist(artistId,5)
        const topAlbums = await this._dashBoarRepository.topPlayedAlbumsByArtist(artistId, 5)


        // const songWithUrls = await Promise.all(
        //     topSongs.map(async(song)=>{
        //         const coverImageUrl = await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey)

        //         return {song, coverImageUrl}
        //     })
        // )

        //const topPlayedSongs =  ArtistDashboardMapper.toDTOList(songWithUrls)
        const topPlayedAlbums = ArtistDashboardMapper.toDTOAlbumList(topAlbums)

        return {
            totalSongs,
            totalAlbums,
            totalFans,
            totalRevenue: totalRevenue/100,
            //topPlayedSongs,
            topPlayedAlbums
        }
    }
}