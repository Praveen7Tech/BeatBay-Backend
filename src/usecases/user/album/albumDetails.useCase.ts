import { IAlbumDetailsUseCase } from "../../../application/interfaces/usecase/album/album-details-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { Album } from "../../../domain/entities/album.entity";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class AlbumDetailsUseCase implements IAlbumDetailsUseCase{
    constructor(
        private readonly _mongooseAlbumRepository: IAlbumRepository
    ){}

    async execute(albumId: string): Promise<Album>{
        
        const albumDetails = await this._mongooseAlbumRepository.findById(albumId)
        if(!albumDetails){
            throw new NotFoundError("album currently not available")
        }

        return albumDetails
    }
}