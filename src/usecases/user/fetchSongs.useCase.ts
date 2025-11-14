import { Song } from "../../domain/entities/song.entity";
import { ISongRepository } from "../../domain/repositories/song.repository";

export class FetchSongsUsecase {
    constructor(
        private readonly mongooseSongRepository: ISongRepository
    ){}

    async execute(): Promise<Song[]>{
        const songs = this.mongooseSongRepository.getAll()

        return songs
    }
}