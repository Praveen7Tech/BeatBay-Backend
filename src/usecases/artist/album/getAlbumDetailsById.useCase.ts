
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { AlbumDetailsDTO } from "../../../application/dto/album/album.response.dto";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { AlbumDetailsMapper } from "../../../application/mappers/artist/album/album-details.mapper";
import { IGetAlbumDetailsByIdUseCase } from "../../../application/interfaces/usecase/album/artisgetalbum-detail-byid-usecase.interface";

export class GetAlbumDetailsByIdUseCase implements IGetAlbumDetailsByIdUseCase{
    constructor(
        private readonly _albumRepository: IAlbumRepository
    ){}

    async execute(albumId: string): Promise<AlbumDetailsDTO>{

        const album = await this._albumRepository.findById(albumId)
        if(!album){
            throw new NotFoundError("album not found")
        }

       return AlbumDetailsMapper.toResponse(album);
    }
}