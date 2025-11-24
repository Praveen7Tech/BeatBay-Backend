import { Song } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class GetSongDetailsByIdUseCase{
    constructor(
        private readonly mongooseSongRepository: ISongRepository, 
    ){}

    async execute(songId: string): Promise<Song | null>{
        const song = await this.mongooseSongRepository.findById(songId)

        return song
    }
}