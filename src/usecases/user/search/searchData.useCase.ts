import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class UserGetSearchDataUseCase{
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _artistRepository: IArtistRepository,
        private readonly _songRepository: ISongRepository,
        private readonly _albumRepository: IAlbumRepository
    ){}

    async execute(query: string){

        const users = this._userRepository.find(query)

        const artists = await this._artistRepository.find(query)

        const songs = await this._songRepository.searchByQuery(query)

        //const albums = await this._albumRepository.
    }
}