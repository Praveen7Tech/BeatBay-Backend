import { AdminAlbumListItemDTO, PaginatedAlbumResponse } from "../../../application/dto/admin/album/album-listing-dto";
import { Album } from "../../../domain/entities/album.entity";
import { GetAllAlbumsRequest } from "../../../domain/interfaces/albumRequest";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class AdminGetAllAlbumsUseCase {
    constructor(private readonly _albumRepository: IAlbumRepository) {}

    async execute(request: GetAllAlbumsRequest): Promise<PaginatedAlbumResponse> {
        const { page, limit } = request;
        const { albums, total } = await this._albumRepository.admingetAllAlbums(request);


        const mappedAlbums: AdminAlbumListItemDTO[] = albums.map((album: Album) => ({
            id: album._id.toString(),
            title: album.title,
            artistName: album.artistName,
            coverImageUrl: album.coverImageUrl,
            trackCount: (album.songs || []).length,
            isActive: album.isActive,
            createdAt: album.createdAt
        }));

        return {
            albums: mappedAlbums,
            totalCount: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
}
