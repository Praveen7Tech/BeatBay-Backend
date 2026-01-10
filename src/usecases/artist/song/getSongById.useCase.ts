import { IGetSongDetailsByIdUseCase } from "../../../application/interfaces/usecase/song/artist-getsong-detail-byid-usecase.interface";
import { Song } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class GetSongDetailsByIdUseCase implements IGetSongDetailsByIdUseCase{
    constructor(
        private readonly _mongooseSongRepository: ISongRepository, 
    ){}

    async execute(songId: string): Promise<Song | null>{
        const song = await this._mongooseSongRepository.findById(songId)

        return song
    }
}