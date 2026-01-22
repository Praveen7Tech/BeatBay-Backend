import { DashBoardResponse } from "../../../application/dto/admin/admin.response.dto";
import { IGetAdminDashBoardDataUseCase } from "../../../application/interfaces/usecase/admin/get-admin-dashboard-usecase.interface";
import { IDashBoardRepository } from "../../../domain/repositories/demographics.repository";

export class GetAdminDashBoardData implements IGetAdminDashBoardDataUseCase{
    constructor(
        private readonly _dashBoarRepository: IDashBoardRepository
    ){}

    async execute():Promise<DashBoardResponse>{
        const userCount =  await this._dashBoarRepository.countAllDocumets('users')

        const artistCount =await this._dashBoarRepository.countAllDocumets('artists')

        const songsCount = await this._dashBoarRepository.countAllDocumets('songs')

        const albumCount = await this._dashBoarRepository.countAllDocumets('albums')

        const playlistCount = await this._dashBoarRepository.countAllDocumets('playlists')

        return{
            totalUser: userCount,
            totalArtist: artistCount,
            totalSongs: songsCount,
            totalAlbums: albumCount,
            totalPlaylists: playlistCount
        }
    }
}