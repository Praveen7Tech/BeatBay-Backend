import { FetchSongsResponseDTO } from "../../../application/dto/song/song.response.dto";
import { IGetSongsUseCase } from "../../../application/interfaces/usecase/song/artist-get-songs-usecase.interface";
import { FetchSongMapper } from "../../../application/mappers/song/fetch-song.mapper";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";

export class GetSongsUseCase implements IGetSongsUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository,
        private readonly _awsStorageService: IAWSS3StorageService
    ){}

    async execute(artistId: string): Promise<FetchSongsResponseDTO>{

        const songs = await this._artistRepository.fetchSongs(artistId)
        const songWithUrls = await Promise.all(
        songs.map(async(song)=>{
            const coverImageUrl = await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey)

            return{song, coverImageUrl}
        })
        )

        return {
              songs: FetchSongMapper.toDTOList(songWithUrls),
        };
    }
}