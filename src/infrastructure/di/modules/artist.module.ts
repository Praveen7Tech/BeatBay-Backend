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
import { ArtistVerifyEmailUsecase } from "../../../usecases/artist/artistVerifyEmail.useCase";
import { ArtistResetPasswordUsecase } from "../../../usecases/artist/artistResetPassword.useCase";
import { ArtistChangePasswordUsecase } from "../../../usecases/artist/artistChangePassword.useCase";
import { UploadSongUseCase } from "../../../usecases/artist/song/UploadSong.useCase";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { MongooseSongRepository } from "../../presistence/mongoose/repositories/mongoose.song.repository";
import { GetSongsUseCase } from "../../../usecases/artist/song/getSongs.useCase";

export const artistModule = {

    // repositories
    artistRepository: asClass<IArtistRepository>(MongooseArtistRepository).scoped(),
    transactionManager: asClass<ITransactionManager>(MongooseTransactionService).scoped(),
    songRepository: asClass<ISongRepository>(MongooseSongRepository).scoped(),

    // usecases
    artistSignupUsecase: asClass(ArtistSignupUsecase).scoped(),
    artistVerifyOTPusecase: asClass(ArtistVerifyOTPuseCase).scoped(),
    artistResendOtpUsecase: asClass(ArtistResendOtpUseCase).scoped(),
    artistLoginUsecase: asClass(ArtistLoginUsecase).scoped(),
    artistEditProfileUsecase: asClass(ArtistEditProfileUsecase).scoped(),
    artistGoogleLoginUsecase: asClass(ArtistGoogleLoginUseCase).scoped(),
    artistVerifyEmailUsecase: asClass(ArtistVerifyEmailUsecase).scoped(),
    artistResetPasswordUsecase: asClass(ArtistResetPasswordUsecase).scoped(),
    artistChangePasswordUsecase: asClass(ArtistChangePasswordUsecase).scoped(),

    // song usecases
    artistUploadSongUsecase: asClass(UploadSongUseCase).scoped(),
    artistGetSongsUsecase: asClass(GetSongsUseCase).scoped(),

    // controller
    artistAuthController: asClass(artistAuthController).scoped(),
    artistController: asClass(ArtistController).scoped()
}