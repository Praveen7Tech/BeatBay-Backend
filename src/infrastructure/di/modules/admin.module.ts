import { asClass } from "awilix";
import { AdminAuthController } from "../../../interfaces/http/controllers/admin/admin.auth.controller";
import { AdminLoginUsecase } from "../../../usecases/admin/adminLogin.useCase";


export const adminModule ={

    // use cases
    adminLoginUsecase: asClass(AdminLoginUsecase).scoped(),

    // controllers
    adminAuthController: asClass(AdminAuthController).scoped()
}