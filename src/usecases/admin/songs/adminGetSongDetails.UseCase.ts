import { IAdminGetSongDetailsByIdUseCase } from "../../../application/interfaces/usecase/admin/get-songdetails-byid-usecase.interface"
import { Song } from "../../../domain/entities/song.entity"
import { ISongRepository } from "../../../domain/repositories/song.repository"

export class AdminGetSongDetailsByIdUseCase implements IAdminGetSongDetailsByIdUseCase{
    constructor(
        private readonly _mongooseSongRepository: ISongRepository, 
    ){}

    async execute(songId: string): Promise<Song | null>{
        const song = await this._mongooseSongRepository.adminfindById(songId)

        return song
    }
}