import { asClass } from "awilix";
import { AdminAuthController } from "../../../interfaces/http/controllers/admin/admin.auth.controller";
import { AdminLoginUsecase } from "../../../usecases/admin/adminLogin.useCase";
import { AdminFeaturesController } from "../../../interfaces/http/controllers/admin/adminFeatures.controller";
import { FetchAllUsersUseCase } from "../../../usecases/admin/users/adminFetchAllUsers.useCase";
import { GetUserByIdUseCase } from "../../../usecases/admin/users/adminGetUserById.useCase";
import { BlockUserUseCase } from "../../../usecases/admin/users/adminBlockUser.useCase";
import { UnBlockUserUseCase } from "../../../usecases/admin/users/adminUnBlockUser.useCase";
import { FetchAllArtistsUseCase } from "../../../usecases/admin/artists/adminFetchAllArtists.useCase";
import { GetArtistByIdUseCase } from "../../../usecases/admin/artists/adminGetArtistById.useCase";
import { BlockArtistUseCase } from "../../../usecases/admin/artists/adminBlockArtist.useCase";
import { UnBlockUArtistUseCase } from "../../../usecases/admin/artists/adminUnBlockArtist.useCase";


export const adminModule ={

    // use cases
    adminLoginUsecase: asClass(AdminLoginUsecase).scoped(),
    adminFetchAllUsers: asClass(FetchAllUsersUseCase).scoped(),
    adminGetUserByIdUsecase: asClass(GetUserByIdUseCase).scoped(),
    adminBlockUserUsecase: asClass(BlockUserUseCase).scoped(),
    adminUnBlockUserUsecase: asClass(UnBlockUserUseCase).scoped(),

    adminFetchAllArtists: asClass(FetchAllArtistsUseCase).scoped(),
    adminGetArtistByIdUsecase: asClass(GetArtistByIdUseCase).scoped(),
    adminBlockArtistUsecase: asClass(BlockArtistUseCase).scoped(),
    adminUnBlockArtistUsecase: asClass(UnBlockUArtistUseCase).scoped(),

    // controllers
    adminAuthController: asClass(AdminAuthController).scoped(),
    adminFeaturesController: asClass(AdminFeaturesController).scoped()
}