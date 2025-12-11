import { Song } from "../../../domain/entities/song.entity";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class GetSongsUseCase {
    constructor(
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(artistId: string): Promise<Song[]>{

        const songs = await this._artistRepository.fetchSongs(artistId)

        return songs
    }
}