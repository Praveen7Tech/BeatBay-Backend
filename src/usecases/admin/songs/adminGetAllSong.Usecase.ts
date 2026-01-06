import { AdminSongListItemDTO, PaginatedSongResponse } from "../../../application/dto/admin/songs/song-listing.dto";
import { GetAllSongsRequest } from "../../../domain/interfaces/songRequest";
import { ISongRepository } from "../../../domain/repositories/song.repository";


export class GetAllSongsUseCase {
    constructor(private readonly _songRepository: ISongRepository) {}

    async execute(request: GetAllSongsRequest): Promise<PaginatedSongResponse> {
        const { page, limit } = request;
        const { songs, total } = await this._songRepository.admingetAllSongs(request);

        // Map to DTO
        const mappedSongs: AdminSongListItemDTO[] = songs.map(song => ({
            id: song._id.toString(),
            title: song.title,
            genre: song.genre,
            coverImageUrl: song.coverImageUrl,
            duration: song.duration,
            status: song.status,
            likesCount: song.likesCount,
            uploadDate: song.createdAt
        }));

        return {
            songs: mappedSongs,
            totalCount: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
}
