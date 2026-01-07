import { asClass } from "awilix";
import { AdminAuthController } from "../../../interfaces/http/controllers/admin/admin.auth.controller";
import { AdminLoginUsecase } from "../../../usecases/admin/auth/adminLogin.useCase";
import { AdminFeaturesController } from "../../../interfaces/http/controllers/admin/adminFeatures.controller";
import { FetchAllUsersUseCase } from "../../../usecases/admin/users/adminFetchAllUsers.useCase";
import { GetUserByIdUseCase } from "../../../usecases/admin/users/adminGetUserById.useCase";
import { BlockUserUseCase } from "../../../usecases/admin/users/adminBlockUser.useCase";
import { UnBlockUserUseCase } from "../../../usecases/admin/users/adminUnBlockUser.useCase";
import { FetchAllArtistsUseCase } from "../../../usecases/admin/artists/adminFetchAllArtists.useCase";
import { GetArtistByIdUseCase } from "../../../usecases/admin/artists/adminGetArtistById.useCase";
import { BlockArtistUseCase } from "../../../usecases/admin/artists/adminBlockArtist.useCase";
import { UnBlockUArtistUseCase } from "../../../usecases/admin/artists/adminUnBlockArtist.useCase";
import { GetAdminDashBoardData } from "../../../usecases/admin/dashboard/adminGetDashboardData";
import { GetAllSongsUseCase } from "../../../usecases/admin/songs/adminGetAllSong.Usecase";
import { GetSongDetailsByIdUseCase } from "../../../usecases/artist/song/getSongById.useCase";
import { ToggleSongStatusUseCase } from "../../../usecases/admin/songs/adminUpdateSongStatus.UseCase";
import { AdminGetSongDetailsByIdUseCase } from "../../../usecases/admin/songs/adminGetSongDetails.UseCase";
import { AdminGetAllAlbumsUseCase } from "../../../usecases/admin/album/adminGetAllAlbums.Usecase";
import { AdminGetAlbumDetailsByIdUseCase } from "../../../usecases/admin/album/adminGetAlbumDetails.UseCase";
import { ToggleAlbumStatusUseCase } from "../../../usecases/admin/album/adminUpdateAlbumStatus.UseCase";


export const adminModule ={

    // use cases
    _adminLoginUsecase: asClass(AdminLoginUsecase).scoped(),
    _adminFetchAllUsers: asClass(FetchAllUsersUseCase).scoped(),
    _adminGetUserByIdUsecase: asClass(GetUserByIdUseCase).scoped(),
    _adminBlockUserUsecase: asClass(BlockUserUseCase).scoped(),
    _adminUnBlockUserUsecase: asClass(UnBlockUserUseCase).scoped(),

    _adminFetchAllArtists: asClass(FetchAllArtistsUseCase).scoped(),
    _adminGetArtistByIdUsecase: asClass(GetArtistByIdUseCase).scoped(),
    _adminBlockArtistUsecase: asClass(BlockArtistUseCase).scoped(),
    _adminUnBlockArtistUsecase: asClass(UnBlockUArtistUseCase).scoped(),

    _adminGetDashBoardData: asClass(GetAdminDashBoardData).scoped(),
    _adminGetAllSongsUsecase: asClass(GetAllSongsUseCase).scoped(),
    _getSongDetailsUseCase: asClass(AdminGetSongDetailsByIdUseCase).scoped(),
    _toggleBlockStatusUseCase: asClass(ToggleSongStatusUseCase).scoped(),

    _adminGetAllAlbumsUsecase: asClass(AdminGetAllAlbumsUseCase).scoped(),
    _getAlbumDetailsUseCase: asClass(AdminGetAlbumDetailsByIdUseCase).scoped(),
    _toggleAlbumStatusUseCase: asClass(ToggleAlbumStatusUseCase).scoped(),

    // controllers
    adminAuthController: asClass(AdminAuthController).scoped(),
    adminFeaturesController: asClass(AdminFeaturesController).scoped()
}