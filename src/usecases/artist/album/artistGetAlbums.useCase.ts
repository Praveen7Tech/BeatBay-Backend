import { Album } from "../../../domain/entities/album.entity";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class artistGetAlbumsUseCase {
    constructor(
        private readonly artistRepository: IArtistRepository
    ){}

    async execute(artistId: string): Promise<Album>{

        const albums = await this.artistRepository.fetchAlbums(artistId)
        return albums
    }
}