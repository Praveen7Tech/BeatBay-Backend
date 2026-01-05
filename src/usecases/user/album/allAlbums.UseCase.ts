import { AlbumListDTO } from "../../../application/dto/album/album.dto";
import { PaginatedResponseDTO } from "../../../application/dto/song/song.dto";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class FetchAllAlbumsUsecase {
    constructor(private readonly _albumRepository: IAlbumRepository) {}

    async execute(page: number, limit: number, query?: string): Promise<PaginatedResponseDTO<AlbumListDTO>> {
        const { albums, total } = await this._albumRepository.getAllAlbum(page, limit, query);

        // Map internal Album entity to public AlbumListDTO
        const mappedAlbums: AlbumListDTO[] = albums.map(album => ({
            id: album._id.toString(),
            title: album.title,
            artistName: album.artistName,
            coverImageUrl: album.coverImageUrl
        }));

        return {
            docs: mappedAlbums,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalDocs: total
        };
    }
}
