import { PaginatedResponseDTO, SongListDTO } from "../../../application/dto/song/song.dto";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class FetchAllSongsUsecase {
    constructor(private readonly _mongooseSongRepository: ISongRepository) {}

    async execute(page: number, limit: number, query?: string): Promise<PaginatedResponseDTO<SongListDTO>> {
        const { songs, total } = await this._mongooseSongRepository.getAllSongs(page, limit, query);

        const mappedSongs: SongListDTO[] = songs.map(song => ({
            id: song._id.toString(),
            title: song.title,
            coverImageUrl: song.coverImageUrl,
            artistName: song.artistName,
            duration: song.duration
        }));

        return {
            docs: mappedSongs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalDocs: total
        };
    }
}
