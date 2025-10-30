import { asClass } from "awilix";
import { artistAuthController } from "../../../interfaces/http/controllers/artist/artist.auth.controller";
import { ArtistSignupUsecase } from "../../../usecases/artist/artistSignup.useCase"; 
import { ArtistVerifyOTPuseCase } from "../../../usecases/artist/artistVerifyOTP.useCase";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { MongooseArtistRepository } from "../../presistence/mongoose/repositories/mongoose.artist.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { MongooseTransactionService } from "../../services/mongoose/mongoose.transaction.service";
import { ArtistResendOtpUseCase } from "../../../usecases/artist/artistResendOTP.useCase";
import { ArtistLoginUsecase } from "../../../usecases/artist/artistLogin.useCase";
import { ArtistController } from "../../../interfaces/http/controllers/artist/artist.controller";
import { ArtistEditProfileUsecase } from "../../../usecases/artist/artistEditProfile.useCase";
import { ArtistGoogleLoginUseCase } from "../../../usecases/artist/artistGoogleSignup.useCase";

export const artistModule = {

    // repositories
    artistRepository: asClass<IArtistRepository>(MongooseArtistRepository).scoped(),
    transactionManager: asClass<ITransactionManager>(MongooseTransactionService).scoped(),

    // usecases
    artistSignupUsecase: asClass(ArtistSignupUsecase).scoped(),
    artistVerifyOTPusecase: asClass(ArtistVerifyOTPuseCase).scoped(),
    artistResendOtpUsecase: asClass(ArtistResendOtpUseCase).scoped(),
    artistLoginUsecase: asClass(ArtistLoginUsecase).scoped(),
    artistEditProfileUsecase: asClass(ArtistEditProfileUsecase).scoped(),
    artistGoogleLoginUsecase: asClass(ArtistGoogleLoginUseCase).scoped(),

    // controller
    artistAuthController: asClass(artistAuthController).scoped(),
    artistController: asClass(ArtistController).scoped()
}