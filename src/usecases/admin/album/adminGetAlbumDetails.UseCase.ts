
import { AdminAlbumDetailsDTO } from "../../../application/dto/admin/album/album-details";
import { IAdminGetAlbumDetailsByIdUseCase } from "../../../application/interfaces/usecase/admin/get-album-details-byid-usecase.interface";
import { AdminAlbumDetailsMapper } from "../../../application/mappers/admin/album/album-details.mapper";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";

export class AdminGetAlbumDetailsByIdUseCase implements IAdminGetAlbumDetailsByIdUseCase{
    constructor(
        private readonly _albumRepository: IAlbumRepository,
        private readonly _awsStorageService: IAWSS3StorageService
    ) {}

    async execute(albumId: string): Promise<AdminAlbumDetailsDTO> {
        const album = await this._albumRepository.adminFindById(albumId);
        
        if (!album) {
            throw new Error("ALBUM_NOT_FOUND");
        }

        const preparedSongs = await Promise.all(
        album.songs.map(async (song) => ({
            ...song,
            coverImageUrl: await this._awsStorageService.getAccessPresignedUrl(
            song.coverImageKey
            ),
        }))
        );

        const preparedAlbum = {
        ...album,
        songs: preparedSongs,
        };


        return AdminAlbumDetailsMapper.toDTO(preparedAlbum);
    }
}