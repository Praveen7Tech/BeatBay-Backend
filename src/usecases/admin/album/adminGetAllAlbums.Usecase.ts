import { PaginatedAlbumResponse } from "../../../application/dto/admin/album/album-listing-dto";
import { AdminAlbumMapper } from "../../../application/mappers/admin/album/album.mapper";
import { GetAllAlbumsRequest } from "../../../domain/interfaces/albumRequest";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class AdminGetAllAlbumsUseCase {
    constructor(private readonly _albumRepository: IAlbumRepository) {}

    async execute(request: GetAllAlbumsRequest): Promise<PaginatedAlbumResponse> {
        const { page, limit } = request;
        const { albums, total } = await this._albumRepository.admingetAllAlbums(request);


        return {
        albums: AdminAlbumMapper.toListItemDTOs(albums),
        totalCount: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
        };
    }
}
