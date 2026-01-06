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

    // controllers
    adminAuthController: asClass(AdminAuthController).scoped(),
    adminFeaturesController: asClass(AdminFeaturesController).scoped()
}