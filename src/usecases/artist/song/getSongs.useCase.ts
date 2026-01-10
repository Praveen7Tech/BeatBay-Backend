import { IGetSongsUseCase } from "../../../application/interfaces/usecase/song/artist-get-songs-usecase.interface";
import { Song } from "../../../domain/entities/song.entity";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class GetSongsUseCase implements IGetSongsUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(artistId: string): Promise<Song[]>{

        const songs = await this._artistRepository.fetchSongs(artistId)

        return songs
    }
}