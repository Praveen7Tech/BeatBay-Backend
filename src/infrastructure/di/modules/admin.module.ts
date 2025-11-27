import { asClass } from "awilix";
import { AdminAuthController } from "../../../interfaces/http/controllers/admin/admin.auth.controller";
import { AdminLoginUsecase } from "../../../usecases/admin/adminLogin.useCase";
import { AdminFeaturesController } from "../../../interfaces/http/controllers/admin/adminFeatures.controller";
import { FetchAllUsersUseCase } from "../../../usecases/admin/users/adminFetchAllUsers.useCase";
import { GetUserByIdUseCase } from "../../../usecases/admin/users/adminGetUserById.useCase";
import { BlockUserUseCase } from "../../../usecases/admin/users/adminBlockUser.useCase";


export const adminModule ={

    // use cases
    adminLoginUsecase: asClass(AdminLoginUsecase).scoped(),
    adminFetchAllUsers: asClass(FetchAllUsersUseCase).scoped(),
    adminGetUserByIdUsecase: asClass(GetUserByIdUseCase).scoped(),
    adminBlockUserUsecase: asClass(BlockUserUseCase).scoped(),

    // controllers
    adminAuthController: asClass(AdminAuthController).scoped(),
    adminFeaturesController: asClass(AdminFeaturesController).scoped()
}