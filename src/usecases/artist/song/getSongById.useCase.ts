import { IGetSongDetailsByIdUseCase } from "../../../application/interfaces/usecase/song/artist-getsong-detail-byid-usecase.interface";
import { Song, SongNew } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class GetSongDetailsByIdUseCase implements IGetSongDetailsByIdUseCase{
    constructor(
        private readonly _mongooseSongRepository: ISongRepository, 
    ){}

    async execute(songId: string): Promise<SongNew | null>{
        const song = await this._mongooseSongRepository.findById(songId)

        return song
    }
}