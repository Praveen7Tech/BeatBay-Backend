
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { AlbumDetailsDTO } from "../../../application/dto/album/album.response.dto";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { AlbumDetailsMapper } from "../../../application/mappers/artist/album/album-details.mapper";
import { IGetAlbumDetailsByIdUseCase } from "../../../application/interfaces/usecase/album/artisgetalbum-detail-byid-usecase.interface";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";

export class GetAlbumDetailsByIdUseCase implements IGetAlbumDetailsByIdUseCase{
    constructor(
        private readonly _albumRepository: IAlbumRepository,
        private readonly _awsStorageService: IAWSS3StorageService
    ){}

    async execute(albumId: string): Promise<AlbumDetailsDTO>{

        const album = await this._albumRepository.findById(albumId)
        if(!album){
            throw new NotFoundError("album not found")
        }

        const songs = await Promise.all(
            album.songs.map(async(s)=>({
                id: s._id,
                title: s.title,
                coverImageUrl: await this._awsStorageService.getAccessPresignedUrl(s.coverImageKey)
            }))
        )

       return AlbumDetailsMapper.toResponse(album, songs);
    }
}