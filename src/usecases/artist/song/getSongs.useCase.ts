import { Song } from "../../../domain/entities/song.entity";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class GetSongsUseCase {
    constructor(
        private readonly artistRepository: IArtistRepository
    ){}

    async execute(artistId: string): Promise<Song[]>{

        const songs = await this.artistRepository.fetchSongs(artistId)

        return songs
    }
}