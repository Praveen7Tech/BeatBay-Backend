import { PaginatedResponseDTO, SongListDTO } from "../../../application/dto/song/song.dto";
import { IFetchAllSongsUsecase } from "../../../application/interfaces/usecase/song/fetch-all-songs-usecase.interface";
import { SongMapper } from "../../../application/mappers/user/song/song.mapper";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";

export class FetchAllSongsUsecase implements IFetchAllSongsUsecase{
    constructor(
        private readonly _mongooseSongRepository: ISongRepository,
        private readonly _awsStorageService: IAWSS3StorageService
    ) {}

    async execute(page: number, limit: number, query?: string): Promise<PaginatedResponseDTO<SongListDTO>> {
        const { songs, total } = await this._mongooseSongRepository.getAllSongs(page, limit, query);

        const songWithUrl = await Promise.all(
            songs.map(async (song)=>{
                const coverImage = await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey)

                return SongMapper.toSongListDTO(song,coverImage)
            })
        )
        return {
            docs: songWithUrl,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalDocs: total
        };
    }
}
