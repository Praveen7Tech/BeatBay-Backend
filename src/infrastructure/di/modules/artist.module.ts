import { asClass } from "awilix";
import { artistAuthController } from "../../../interfaces/http/controllers/artist/artist.auth.controller";
import { artistSignupUsecase } from "../../../usecases/artist/artistSignup.useCase";

export const artistModule = {

    // usecases
    artistSignupUsecase: asClass(artistSignupUsecase).scoped(),

    // controller
    artistAuthController: asClass(artistAuthController).scoped()
}