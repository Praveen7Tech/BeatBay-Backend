import { asClass } from "awilix";
import { UserController } from "../../../interfaces/http/controllers/user/user.controller";
import { editProfileUsecase } from "../../../usecases/user/editProfile.useCase";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { MongooseUserRepository } from "../../presistence/mongoose/repositories/mongoose.user.repository";
import { ChangePasswordUsecase } from "../../../usecases/user/changePassword.useCase";

export const userModule = {
    // services
    userReposistory: asClass<IUserRepository>(MongooseUserRepository).scoped(),

    //useCases
    editProfileUserUsecase: asClass(editProfileUsecase).scoped(),
    changePasswordUsecase: asClass(ChangePasswordUsecase).scoped(),

    // controller
    userController: asClass(UserController).scoped(),
}