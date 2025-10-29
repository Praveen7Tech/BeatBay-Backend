import { asClass } from "awilix";
import { UserController } from "../../../interfaces/http/controllers/user/user.controller";
import { editProfileUsecase } from "../../../usecases/user/editProfile.useCase";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { MongooseUserRepository } from "../../presistence/mongoose/repositories/mongoose.user.repository";

export const userModule = {
    // services
    userReposistory: asClass<IUserRepository>(MongooseUserRepository).scoped(),

    //useCases
    editProfileUserUsecase: asClass(editProfileUsecase).scoped(),

    // controller
    userController: asClass(UserController).scoped(),
}