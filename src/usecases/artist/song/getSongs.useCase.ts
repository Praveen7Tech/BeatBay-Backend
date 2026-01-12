import { FetchSongsResponseDTO } from "../../../application/dto/song/song.response.dto";
import { IGetSongsUseCase } from "../../../application/interfaces/usecase/song/artist-get-songs-usecase.interface";
import { FetchSongMapper } from "../../../application/mappers/song/fetch-song.mapper";
import { Song } from "../../../domain/entities/song.entity";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class GetSongsUseCase implements IGetSongsUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(artistId: string): Promise<FetchSongsResponseDTO>{

        const songs = await this._artistRepository.fetchSongs(artistId)

        return {
              songs: FetchSongMapper.toDTOList(songs),
        };
    }
}