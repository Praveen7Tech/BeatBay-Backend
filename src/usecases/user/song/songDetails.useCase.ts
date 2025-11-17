import { Song } from "../../../domain/entities/song.entity";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class SongDetailsUseCase {
    constructor(
        private readonly mongooseSongRepository: ISongRepository
    ){}

    async execute(songId: string): Promise<Song | null>{

        const songDeails = await this.mongooseSongRepository.findById(songId)

        return songDeails
    }
}