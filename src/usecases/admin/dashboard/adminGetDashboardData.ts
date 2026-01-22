import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { DashBoardResponse } from "../../../application/dto/admin/admin.response.dto";
import { IGetAdminDashBoardDataUseCase } from "../../../application/interfaces/usecase/admin/get-admin-dashboard-usecase.interface";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";

export class GetAdminDashBoardData implements IGetAdminDashBoardDataUseCase{
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _artistRepository: IArtistRepository,
        private readonly _songRepository: ISongRepository,
        private readonly _albumRepository: IAlbumRepository,
        private readonly _mongoosePlayListRepository: IPlayListRepository,
    ){}

    async execute():Promise<DashBoardResponse>{
        const userCount =  await this._userRepository.countDocuments()

        const artistCount =await this._artistRepository.countDocuments()

        const songsCount = await this._songRepository.countDocuments()

        const albumCount = await this._albumRepository.countDocuments()

        const playlistCount = await this._mongoosePlayListRepository.countDocuments()

        return{
            totalUser: userCount,
            totalArtist: artistCount,
            totalSongs: songsCount,
            totalAlbums: albumCount,
            totalPlaylists: playlistCount
        }
    }
}