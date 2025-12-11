import { Album } from "../../../domain/entities/album.entity"
import { IAlbumRepository } from "../../../domain/repositories/album.repository"

export class FetchAlbumsUsecase {
    constructor(
        private readonly _mongooseAlbumRepository: IAlbumRepository
    ){}
    
    async execute(): Promise<Album[]>{
        const albums = this._mongooseAlbumRepository.getAll()
    
        return albums
    }
}