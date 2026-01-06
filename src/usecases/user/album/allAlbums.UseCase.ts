import { AlbumListDTO } from "../../../application/dto/album/album.dto";
import { PaginatedResponseDTO } from "../../../application/dto/song/song.dto";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { AlbumMapper } from "../../../application/mappers/user/album/album.mapper"; 

export class FetchAllAlbumsUsecase {
    constructor(private readonly _albumRepository: IAlbumRepository) {}

    async execute(page: number,limit: number,query?: string): Promise<PaginatedResponseDTO<AlbumListDTO>> {

        const { albums, total } = await this._albumRepository.getAllAlbum(page, limit, query);

        const album = AlbumMapper.toAlbumListDTOs(albums)
        return {
            docs: album,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalDocs: total
        };
    }
}
