import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { DashBoardResponse } from "../../dto/admin/admin.response.dto";

export class GetAdminDashBoardData{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly artistRepository: IArtistRepository,
        private readonly songRepository: ISongRepository,
        private readonly albumRepository: IAlbumRepository
    ){}

    async execute():Promise<DashBoardResponse>{
        const userCount =  await this.userRepository.countDocuments()

        const artistCount =await this.artistRepository.countDocuments()

        const songsCount = await this.songRepository.countDocuments()

        const albumCount = await this.albumRepository.countDocuments()

        return{
            totalUser: userCount,
            totalArtist: artistCount,
            totalSongs: songsCount,
            totalAlbums: albumCount
        }
    }
}