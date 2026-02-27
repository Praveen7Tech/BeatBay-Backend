import { asClass, asValue } from "awilix";
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
import { ToggleSongStatusUseCase } from "../../../usecases/admin/songs/adminUpdateSongStatus.UseCase";
import { AdminGetSongDetailsByIdUseCase } from "../../../usecases/admin/songs/adminGetSongDetails.UseCase";
import { AdminGetAllAlbumsUseCase } from "../../../usecases/admin/album/adminGetAllAlbums.Usecase";
import { AdminGetAlbumDetailsByIdUseCase } from "../../../usecases/admin/album/adminGetAlbumDetails.UseCase";
import { ToggleAlbumStatusUseCase } from "../../../usecases/admin/album/adminUpdateAlbumStatus.UseCase";
import { DashBoardDemographicsUseCase } from "../../../usecases/admin/dashboard/adminDemographics.UseCase";
import { IDashBoardRepository } from "../../../domain/repositories/demographics.repository";
import { MongooseDashBoardRepository } from "../../presistence/mongoose/repositories/mongoose.dashBoard.repository";
import { dashBoardModels } from "../../presistence/mongoose/models-listing/dashboard-models";
import { DashBoardEntityBreakDownUseCase } from "../../../usecases/admin/dashboard/adminEntityBreakdown.UseCase";
import { RevenueDashboardStatisticsUseCase } from "../../../usecases/admin/revenue/revenueDashboradDetails.UseCase";
import { RevenueDashboardChartUseCase } from "../../../usecases/admin/revenue/revenueDashboardChart.UseCase";
import { RevenuePayoutHistoryUseCase } from "../../../usecases/admin/revenue/revenuePayoutHistory.UseCase";


export const adminModule ={

    _dashBoardModels : asValue(dashBoardModels),

    // dashbord repository setup
    _dashBoarRepository: asClass<IDashBoardRepository>(MongooseDashBoardRepository).scoped(),

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

    //demographics
    _dashBoardDemographicsUsecase: asClass(DashBoardDemographicsUseCase).scoped(),
    _dashBoardEntityBreakDownUseCase: asClass(DashBoardEntityBreakDownUseCase).scoped(),

    // revenue dashboard
    _revenueDashbaordStatistics: asClass(RevenueDashboardStatisticsUseCase).scoped(),
    _revenueDashboardChartUsecase: asClass(RevenueDashboardChartUseCase).scoped(),
    _revenuePayoutHistoryUsecase: asClass(RevenuePayoutHistoryUseCase).scoped(),

    // controllers
    adminAuthController: asClass(AdminAuthController).scoped(),
    adminFeaturesController: asClass(AdminFeaturesController).scoped()
}