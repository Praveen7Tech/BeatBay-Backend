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

export const artistModule = {

    // repositories
    artistRepository: asClass<IArtistRepository>(MongooseArtistRepository).scoped(),
    transactionManager: asClass<ITransactionManager>(MongooseTransactionService).scoped(),

    // usecases
    artistSignupUsecase: asClass(ArtistSignupUsecase).scoped(),
    artistVerifyOTPusecase: asClass(ArtistVerifyOTPuseCase).scoped(),
    artistResendOtpUsecase: asClass(ArtistResendOtpUseCase).scoped(),
    artistLoginUsecase: asClass(ArtistLoginUsecase).scoped(),

    // controller
    artistAuthController: asClass(artistAuthController).scoped()
}