import { NotFoundError } from "../../../common/errors/common/common.errors";
import { Album } from "../../../domain/entities/album.entity";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class AlbumDetailsUseCase {
    constructor(
        private readonly _mongooseAlbumRepository: IAlbumRepository
    ){}

    async execute(albumId: string): Promise<Album | null>{
        
        const albumDetails = await this._mongooseAlbumRepository.findById(albumId)
        if(!albumDetails){
            throw new NotFoundError("album currently not available")
        }

        return albumDetails
    }
}