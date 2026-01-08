import { PaginatedSongResponse } from "../../../application/dto/admin/songs/song-listing.dto";
import { AdminSongMapper } from "../../../application/mappers/admin/song/song.mapper";
import { GetAllSongsRequest } from "../../../domain/interfaces/songRequest";
import { ISongRepository } from "../../../domain/repositories/song.repository";


export class GetAllSongsUseCase {
    constructor(private readonly _songRepository: ISongRepository) {}

    async execute(request: GetAllSongsRequest): Promise<PaginatedSongResponse> {
        const { page, limit } = request;
        const { songs, total } = await this._songRepository.admingetAllSongs(request);

        // Map to DTO
         return {
            songs: AdminSongMapper.toListItemDTOs(songs),
            totalCount: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
}
