
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { AlbumDetailsDTO } from "../../../application/dto/album/album.response.dto";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { AlbumDetailsMapper } from "../../../application/mappers/artist/album/album-details.mapper";

export class GetAlbumDetailsByIdUseCase{
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