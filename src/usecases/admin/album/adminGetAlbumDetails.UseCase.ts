
import { AdminAlbumDetailsDTO } from "../../../application/dto/admin/album/album-details";
import { AdminAlbumDetailsMapper } from "../../../application/mappers/admin/album/album-details.mapper";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class AdminGetAlbumDetailsByIdUseCase {
    constructor(private readonly _albumRepository: IAlbumRepository) {}

    async execute(albumId: string): Promise<AdminAlbumDetailsDTO | null> {
        const album = await this._albumRepository.adminFindById(albumId);
        
        if (!album) {
            throw new Error("ALBUM_NOT_FOUND");
        }

        return AdminAlbumDetailsMapper.toDTO(album);
    }
}