import { Album } from "../../../domain/entities/album.entity";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class AlbumDetailsUseCase {
    constructor(
        private readonly mongooseAlbumRepository: IAlbumRepository
    ){}

    async execute(albumId: string): Promise<Album | null>{
        
        const albumDetails = await this.mongooseAlbumRepository.findById(albumId)

        return albumDetails
    }
}