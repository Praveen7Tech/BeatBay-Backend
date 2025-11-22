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
import { SongDetailsUseCase } from "../../../usecases/user/song/songDetails.useCase";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { SongRecommentationService } from "../../services/recomentation/song.recomentation.service";
import { AlbumDetailsUseCase } from "../../../usecases/user/album/albumDetails.useCase";
import { ArtistDetailsUseCase } from "../../../usecases/user/artist/artistDeatils.useCase";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { MongooseArtistRepository } from "../../presistence/mongoose/repositories/mongoose.artist.repository";
import { CheckFollowStatusUseCase } from "../../../usecases/user/artist/checkFollowStatus.useCase";
import { FollowArtistUseCase } from "../../../usecases/user/artist/followArtist.useCase";
import { UnfollowArtistUseCase } from "../../../usecases/user/artist/unFollowArtist.useCase";
import { GetFollowingListUseCase } from "../../../usecases/user/follow/following.useCase";
import { CreatePlayListUseCase } from "../../../usecases/user/playList/createPlayList.useCase";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { MongoosePlayListRepository } from "../../presistence/mongoose/repositories/mongoose.playList.repository";
import { GetPlayListUseCase } from "../../../usecases/user/playList/getPlayList.useCase";
import { GetAllPlaylistUseCase } from "../../../usecases/user/playList/getAllPlaylist.useCase";
import { AddToPlayListUseCase } from "../../../usecases/user/playList/addToPlayList.useCase";

export const userModule = {
    // Repository
    userReposistory: asClass<IUserRepository>(MongooseUserRepository).scoped(),
    mongooseSongRepository: asClass<ISongRepository>(MongooseSongRepository).scoped(),
    mongooseAlbumRepository: asClass<IAlbumRepository>(MongooseAlbumRepository).scoped(),
    mongooseArtistRepository: asClass<IArtistRepository>(MongooseArtistRepository).scoped(),
    mongoosePlayListRepository: asClass<IPlayListRepository>(MongoosePlayListRepository).scoped(),

    // services
    recomentationService: asClass<IRecomentationService>(SongRecommentationService).scoped(),

    //useCases
    editProfileUserUsecase: asClass(editProfileUsecase).scoped(),
    changePasswordUsecase: asClass(ChangePasswordUsecase).scoped(),
    fetchSongsUsecase: asClass(FetchSongsUsecase).scoped(),
    fetchAlbumsUsecase: asClass(FetchAlbumsUsecase).scoped(),

    // song usecases
    songDetailsUsecase: asClass(SongDetailsUseCase).scoped(),
    albumDetailsUsecase: asClass(AlbumDetailsUseCase).scoped(),
    artistDetailsUsecase: asClass(ArtistDetailsUseCase).scoped(),

    // follow/unfollow
    checkFollowStatusUsecase: asClass(CheckFollowStatusUseCase).scoped(),
    followArtistUsecase: asClass(FollowArtistUseCase).scoped(),
    unfollowArtistUsecase: asClass(UnfollowArtistUseCase).scoped(),
    followingUsecase: asClass(GetFollowingListUseCase).scoped(),

    //playList
    createPlayListUsecase: asClass(CreatePlayListUseCase).scoped(),
    getPlayListUsecase: asClass(GetPlayListUseCase).scoped(),
    getAllPlayListUsecase: asClass(GetAllPlaylistUseCase).scoped(),
    addToPlayListUsecase: asClass(AddToPlayListUseCase).scoped(),

    // controller
    userController: asClass(UserController).scoped(),
}