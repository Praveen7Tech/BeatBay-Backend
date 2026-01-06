import { asClass } from "awilix";
import { artistAuthController } from "../../../interfaces/http/controllers/artist/artist.auth.controller";
import { ArtistSignupUsecase } from "../../../usecases/artist/auth/artistSignup.useCase"; 
import { ArtistVerifyOTPuseCase } from "../../../usecases/artist/auth/artistVerifyOTP.useCase";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { MongooseArtistRepository } from "../../presistence/mongoose/repositories/mongoose.artist.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { MongooseTransactionService } from "../../services/mongoose/mongoose.transaction.service";
import { ArtistResendOtpUseCase } from "../../../usecases/artist/auth/artistResendOTP.useCase";
import { ArtistLoginUsecase } from "../../../usecases/artist/auth/artistLogin.useCase";
import { ArtistController } from "../../../interfaces/http/controllers/artist/artist.controller";
import { ArtistEditProfileUsecase } from "../../../usecases/artist/profile/artistEditProfile.useCase";
import { ArtistGoogleLoginUseCase } from "../../../usecases/artist/auth/artistGoogleSignup.useCase";
import { ArtistVerifyEmailUsecase } from "../../../usecases/artist/auth/artistVerifyEmail.useCase";
import { ArtistResetPasswordUsecase } from "../../../usecases/artist/auth/artistResetPassword.useCase"; 
import { ArtistChangePasswordUsecase } from "../../../usecases/artist/profile/artistChangePassword.useCase";
import { UploadSongUseCase } from "../../../usecases/artist/song/uploadSong.useCase";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { MongooseSongRepository } from "../../presistence/mongoose/repositories/mongoose.song.repository";
import { GetSongsUseCase } from "../../../usecases/artist/song/getSongs.useCase";
import { ArtistCreateAlbumUseCase } from "../../../usecases/artist/album/createAlbums.useCase";
import { MongooseAlbumRepository } from "../../presistence/mongoose/repositories/mongoose.album.repository";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { artistGetAlbumsUseCase } from "../../../usecases/artist/album/artistGetAlbums.useCase";
import { GetSongDetailsByIdUseCase } from "../../../usecases/artist/song/getSongById.useCase";
import { EditSongUseCase } from "../../../usecases/artist/song/editSong.useCase";
import { GetAlbumDetailsByIdUseCase } from "../../../usecases/artist/album/getAlbumDetailsById.useCase";
import { EditAlbumUseCase } from "../../../usecases/artist/album/artistEditAlbum.useCase";
import { DeleteSongUseCase } from "../../../usecases/artist/song/deleteSong.useCase";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { MongoosePlayListRepository } from "../../presistence/mongoose/repositories/mongoose.playList.repository";
import { DeleteAlbumUsecase } from "../../../usecases/artist/album/artistDeleteAlbum.useCase";
import { AlbumDetailsUseCase } from "../../../usecases/user/album/albumDetails.useCase";
import { GetArtistByIdUseCase } from "../../../usecases/admin/artists/adminGetArtistById.useCase";

export const artistModule = {

    // repositories
    _artistRepository: asClass<IArtistRepository>(MongooseArtistRepository).scoped(),
    _transactionManager: asClass<ITransactionManager>(MongooseTransactionService).scoped(),
    _songRepository: asClass<ISongRepository>(MongooseSongRepository).scoped(),
    _albumRepository: asClass<IAlbumRepository>(MongooseAlbumRepository).scoped(),
    _playListRepository: asClass<IPlayListRepository>(MongoosePlayListRepository).scoped(),

    // usecases
    _artistSignupUsecase: asClass(ArtistSignupUsecase).scoped(),
    _artistVerifyOTPusecase: asClass(ArtistVerifyOTPuseCase).scoped(),
    _artistResendOtpUsecase: asClass(ArtistResendOtpUseCase).scoped(),
    _artistLoginUsecase: asClass(ArtistLoginUsecase).scoped(),
    _artistEditProfileUsecase: asClass(ArtistEditProfileUsecase).scoped(),
    _artistGoogleLoginUsecase: asClass(ArtistGoogleLoginUseCase).scoped(),
    _artistVerifyEmailUsecase: asClass(ArtistVerifyEmailUsecase).scoped(),
    _artistResetPasswordUsecase: asClass(ArtistResetPasswordUsecase).scoped(),
    _artistChangePasswordUsecase: asClass(ArtistChangePasswordUsecase).scoped(),
    _getArtistDetailsUsecase: asClass(GetArtistByIdUseCase).scoped(),

    // song usecases
    _artistUploadSongUsecase: asClass(UploadSongUseCase).scoped(),
    _artistGetSongsUsecase: asClass(GetSongsUseCase).scoped(),
    _artistsongDetailsUsecase: asClass(GetSongDetailsByIdUseCase).scoped(),
    _editSongUsecase: asClass(EditSongUseCase).scoped(),
    _artistDeleteSongUsecase: asClass(DeleteSongUseCase).scoped(),

    // albums usecase
    _artistCreateAlbumUsecase: asClass(ArtistCreateAlbumUseCase).scoped(),
    _artistGetAlbumsUsecase: asClass(artistGetAlbumsUseCase).scoped(),
    _artistAlbumDetailsUsecase: asClass(GetAlbumDetailsByIdUseCase).scoped(),
    _artistEditAlbumUsecase: asClass(EditAlbumUseCase).scoped(),
    _artistDeleteAlbumUsecase: asClass(DeleteAlbumUsecase).scoped(),
    _getAlbumDetailsUsecase: asClass(AlbumDetailsUseCase).scoped(),
    

    // controller
    artistAuthController: asClass(artistAuthController).scoped(),
    artistController: asClass(ArtistController).scoped()
}