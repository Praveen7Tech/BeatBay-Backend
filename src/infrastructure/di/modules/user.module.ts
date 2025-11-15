import { asClass } from "awilix";
import { UserController } from "../../../interfaces/http/controllers/user/user.controller";
import { editProfileUsecase } from "../../../usecases/user/editProfile.useCase";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { MongooseUserRepository } from "../../presistence/mongoose/repositories/mongoose.user.repository";
import { ChangePasswordUsecase } from "../../../usecases/user/changePassword.useCase";
import { FetchSongsUsecase } from "../../../usecases/user/fetchSongs.useCase";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { MongooseSongRepository } from "../../presistence/mongoose/repositories/mongoose.song.repository";
import { FetchAlbumsUsecase } from "../../../usecases/user/fetchAlbums.useCase";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { MongooseAlbumRepository } from "../../presistence/mongoose/repositories/mongoose.album.repository";

export const userModule = {
    // services
    userReposistory: asClass<IUserRepository>(MongooseUserRepository).scoped(),
    mongooseSongRepository: asClass<ISongRepository>(MongooseSongRepository).scoped(),
    mongooseAlbumRepository: asClass<IAlbumRepository>(MongooseAlbumRepository).scoped(),

    //useCases
    editProfileUserUsecase: asClass(editProfileUsecase).scoped(),
    changePasswordUsecase: asClass(ChangePasswordUsecase).scoped(),
    fetchSongsUsecase: asClass(FetchSongsUsecase).scoped(),
    fetchAlbumsUsecase: asClass(FetchAlbumsUsecase).scoped(),

    // controller
    userController: asClass(UserController).scoped(),
}