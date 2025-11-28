import { Album } from "../../../domain/entities/album.entity"
import { IAlbumRepository } from "../../../domain/repositories/album.repository"
import { IArtistRepository } from "../../../domain/repositories/artist.repository"

export class FetchAlbumsUsecase {
    constructor(
        private readonly mongooseAlbumRepository: IAlbumRepository
    ){}
    
    async execute(): Promise<Album[]>{
        const albums = this.mongooseAlbumRepository.getAll()
    
        return albums
    }
}