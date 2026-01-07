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
import { UserGetSearchDataUseCase } from "../../../usecases/user/search/searchData.useCase";
import { ISearchService } from "../../../domain/services/search.service";
import { SearchResponseService } from "../../services/search/search.service";
import { GetUserProfileUseCase } from "../../../usecases/user/profile/getUserProfile.useCase";
import { FollowingHandleUseCase } from "../../../usecases/user/follow/followArtist.useCase";
import { GetUserFriendsUseCase } from "../../../usecases/user/friends/getFriends.useCase";
import { FetchAllSongsUsecase } from "../../../usecases/user/song/allSongs.UseCase";
import { FetchAllAlbumsUsecase } from "../../../usecases/user/album/allAlbums.UseCase";
import { GetProfileFollowersPreviewUseCase } from "../../../usecases/user/followers/getUserFollowers.UseCase";
import { SongHydrationUseCase } from "../../../usecases/user/song/songHydration.UseCase";

export const userModule = {
    // Repository
    _userReposistory: asClass<IUserRepository>(MongooseUserRepository).scoped(),
    _mongooseSongRepository: asClass<ISongRepository>(MongooseSongRepository).scoped(),
    _mongooseAlbumRepository: asClass<IAlbumRepository>(MongooseAlbumRepository).scoped(),
    _mongooseArtistRepository: asClass<IArtistRepository>(MongooseArtistRepository).scoped(),
    _mongoosePlayListRepository: asClass<IPlayListRepository>(MongoosePlayListRepository).scoped(),

    // services
    _recomentationService: asClass<IRecomentationService>(SongRecommentationService).scoped(),
    _searchService: asClass<ISearchService>(SearchResponseService).singleton(),

    //useCases
    _editProfileUserUsecase: asClass(editProfileUsecase).scoped(),
    _changePasswordUsecase: asClass(ChangePasswordUsecase).scoped(),
    _fetchSongsUsecase: asClass(FetchSongsUsecase).scoped(),
    _fetchAlbumsUsecase: asClass(FetchAlbumsUsecase).scoped(),
    _getUserDetailsUsecase: asClass(GetUserByIdUseCase).scoped(),

    _fetchAllSongsUsecase:asClass(FetchAllSongsUsecase).scoped(),
    _fetchallAlbumsUsecase:asClass(FetchAllAlbumsUsecase).scoped(),

    // song usecases
    _songDetailsUsecase: asClass(SongDetailsUseCase).scoped(),
    _albumDetailsUsecase: asClass(AlbumDetailsUseCase).scoped(),
    _artistDetailsUsecase: asClass(ArtistDetailsUseCase).scoped(),
    _songHydrationUsecase:asClass(SongHydrationUseCase).scoped(),

    // follow/unfollow
    _checkFollowStatusUsecase: asClass(CheckFollowStatusUseCase).scoped(),
    _followHandleUsecase: asClass(FollowingHandleUseCase).scoped(),
    _followingUsecase: asClass(GetFollowingListUseCase).scoped(),
    _followersUsecase:asClass(GetProfileFollowersPreviewUseCase).scoped(),

    //playList
    _createPlayListUsecase: asClass(CreatePlayListUseCase).scoped(),
    _getPlayListUsecase: asClass(GetPlayListUseCase).scoped(),
    _getAllPlayListUsecase: asClass(GetAllPlaylistUseCase).scoped(),
    _addToPlayListUsecase: asClass(AddToPlayListUseCase).scoped(),
    _searchSongsUseCase: asClass(SearchSongsUseCase).scoped(),
    _editPlauListUsecase: asClass(EditPlayListUseCase).scoped(),

    //search(discover)
    _userSearchDataUsecase: asClass(UserGetSearchDataUseCase).scoped(),
    _getUserProfileDetailsUsecase: asClass(GetUserProfileUseCase).scoped(),

    //friends
    _userFriendsListsUseCase: asClass(GetUserFriendsUseCase).scoped(),

    // controller
    userController: asClass(UserController).scoped(),
}