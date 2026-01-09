import { PaginatedResponseDTO, SongListDTO } from "../../../application/dto/song/song.dto";
import { IFetchAllSongsUsecase } from "../../../application/interfaces/usecase/song/fetch-all-songs-usecase.interface";
import { SongMapper } from "../../../application/mappers/user/song/song.mapper";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class FetchAllSongsUsecase implements IFetchAllSongsUsecase{
    constructor(
        private readonly _mongooseSongRepository: ISongRepository
    ) {}

    async execute(page: number, limit: number, query?: string): Promise<PaginatedResponseDTO<SongListDTO>> {
        const { songs, total } = await this._mongooseSongRepository.getAllSongs(page, limit, query);

        return {
            docs: songs.map(SongMapper.toSongListDTO),
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalDocs: total
        };
    }
}
