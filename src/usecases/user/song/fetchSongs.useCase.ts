import { IFetchSongsUsecase } from "../../../application/interfaces/usecase/song/fetch-songs-usecase.interface";
import { Song } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class FetchSongsUsecase implements IFetchSongsUsecase {
    constructor(
        private readonly _mongooseSongRepository: ISongRepository
    ){}

    async execute(): Promise<Song[]>{
        const songs = this._mongooseSongRepository.getAll()

        return songs
    }
}