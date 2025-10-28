import { asClass } from "awilix";
import { UserController } from "../../../interfaces/http/controllers/user/user.controller";
import { editProfileUsecase } from "../../../usecases/user/editProfile.useCase";

export const userModule = {
    // services

    //useCases
    editProfileUserUsecase: asClass(editProfileUsecase).scoped(),

    // controller
    userController: asClass(UserController).scoped(),
}