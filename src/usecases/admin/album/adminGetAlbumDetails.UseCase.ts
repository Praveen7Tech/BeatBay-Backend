
import { AdminAlbumDetailsDTO } from "../../../application/dto/admin/album/album-details";
import { IAdminGetAlbumDetailsByIdUseCase } from "../../../application/interfaces/usecase/admin/get-album-details-byid-usecase.interface";
import { AdminAlbumDetailsMapper } from "../../../application/mappers/admin/album/album-details.mapper";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class AdminGetAlbumDetailsByIdUseCase implements IAdminGetAlbumDetailsByIdUseCase{
    constructor(private readonly _albumRepository: IAlbumRepository) {}

    async execute(albumId: string): Promise<AdminAlbumDetailsDTO> {
        const album = await this._albumRepository.adminFindById(albumId);
        
        if (!album) {
            throw new Error("ALBUM_NOT_FOUND");
        }

        return AdminAlbumDetailsMapper.toDTO(album);
    }
}