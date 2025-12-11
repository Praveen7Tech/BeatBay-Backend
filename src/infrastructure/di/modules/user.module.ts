import { asClass } from "awilix";
import { UserController } from "../../../interfaces/http/controllers/user/user.controller";
import { editProfileUsecase } from "../../../usecases/user/profile/editProfile.useCase"; 
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { MongooseUserRepository } from "../../presistence/mongoose/repositories/mongoose.user.repository";
import { ChangePasswordUsecase } from "../../../usecases/user/profile/changePassword.useCase"; 
import { FetchSongsUsecase } from "../../../usecases/user/song/fetchSongs.useCase";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { MongooseSongRepository } from "../../presistence/mongoose/repositories/mongoose.song.repository";
import { FetchAlbumsUsecase } from "../../../usecases/user/album/fetchAlbums.useCase";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { MongooseAlbumRepository } from "../../presistence/mongoose/repositories/mongoose.album.repository";
import { SongDetailsUseCase } from "../../../usecases/user/song/songDetails.useCase";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { SongRecommentationService } from "../../services/recomentation/song.recomentation.service";
import { AlbumDetailsUseCase } from "../../../usecases/user/album/albumDetails.useCase";
import { ArtistDetailsUseCase } from "../../../usecases/user/artist/artistDeatils.useCase";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { MongooseArtistRepository } from "../../presistence/mongoose/repositories/mongoose.artist.repository";
import { CheckFollowStatusUseCase } from "../../../usecases/user/follow/checkFollowStatus.useCase";
import { FollowArtistUseCase } from "../../../usecases/user/follow/followArtist.useCase";
import { UnfollowArtistUseCase } from "../../../usecases/user/follow/unFollowArtist.useCase";
import { GetFollowingListUseCase } from "../../../usecases/user/follow/following.useCase";
import { CreatePlayListUseCase } from "../../../usecases/user/playList/createPlayList.useCase";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { MongoosePlayListRepository } from "../../presistence/mongoose/repositories/mongoose.playList.repository";
import { GetPlayListUseCase } from "../../../usecases/user/playList/getPlayList.useCase";
import { GetAllPlaylistUseCase } from "../../../usecases/user/playList/getAllPlaylist.useCase";
import { AddToPlayListUseCase } from "../../../usecases/user/playList/addToPlayList.useCase";
import { SearchSongsUseCase } from "../../../usecases/user/song/searchSong.useCase";
import { EditPlayListUseCase } from "../../../usecases/user/playList/editPlayList.useCase";
import { GetUserByIdUseCase } from "../../../usecases/admin/users/adminGetUserById.useCase";

export const userModule = {
    // Repository
    _userReposistory: asClass<IUserRepository>(MongooseUserRepository).scoped(),
    _mongooseSongRepository: asClass<ISongRepository>(MongooseSongRepository).scoped(),
    _mongooseAlbumRepository: asClass<IAlbumRepository>(MongooseAlbumRepository).scoped(),
    _mongooseArtistRepository: asClass<IArtistRepository>(MongooseArtistRepository).scoped(),
    _mongoosePlayListRepository: asClass<IPlayListRepository>(MongoosePlayListRepository).scoped(),

    // services
    _recomentationService: asClass<IRecomentationService>(SongRecommentationService).scoped(),

    //useCases
    editProfileUserUsecase: asClass(editProfileUsecase).scoped(),
    changePasswordUsecase: asClass(ChangePasswordUsecase).scoped(),
    fetchSongsUsecase: asClass(FetchSongsUsecase).scoped(),
    fetchAlbumsUsecase: asClass(FetchAlbumsUsecase).scoped(),
    getUserDetailsUsecase: asClass(GetUserByIdUseCase).scoped(),

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
    searchSongsUseCase: asClass(SearchSongsUseCase).scoped(),
    editPlauListUsecase: asClass(EditPlayListUseCase).scoped(),

    // controller
    userController: asClass(UserController).scoped(),
}