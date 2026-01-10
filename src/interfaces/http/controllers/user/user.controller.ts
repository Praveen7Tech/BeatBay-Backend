import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../../common/constants/status.enum"
import { MESSAGES } from "../../../../common/constants/constants.message"
import { AuthRequest } from "../../../middleware/auth/authMiddleware"
import { ChangePasswordRequestDTO, EditProfileRequestDTO } from "../../../../application/dto/profile/profile.dto"
import { ChangePasswordSchema, EditProfileSchema } from "../../validators/profile/profile.validators"
import cloudinary from "../../../../infrastructure/config/cloudinary"
import { uploadOptionsType } from "../../../../infrastructure/config/cloudinary"
import { IGetUserByIdUseCase } from "../../../../application/interfaces/usecase/user-features/get-userbyid-usecase.interface"
import { IEditProfileUseCase } from "../../../../application/interfaces/usecase/user-features/edit-profile-usecase.interface"
import { IChangePasswordUsecase } from "../../../../application/interfaces/usecase/user-features/change-password-usecase.interface"
import { IFetchSongsUsecase } from "../../../../application/interfaces/usecase/song/fetch-songs-usecase.interface"
import { IFetchAlbumsUsecase } from "../../../../application/interfaces/usecase/album/fetch-albums-usecase.interface"
import { ISongDetailsUseCase } from "../../../../application/interfaces/usecase/song/song-details-usecaase.interface"
import { ISongHydrationUseCase } from "../../../../application/interfaces/usecase/song/song-hydration-useace.interface"
import { IAlbumDetailsUseCase } from "../../../../application/interfaces/usecase/album/album-details-usecase.interface"
import { IArtistDetailsUseCase } from "../../../../application/interfaces/usecase/artist-features/artist-details-usecase.interface"
import { ICheckFollowStatusUseCase } from "../../../../application/interfaces/usecase/following/check-follow-status-usecase.interface"
import { IFollowingHandleUseCase } from "../../../../application/interfaces/usecase/following/following-handle-usecase.interface"
import { IGetFollowingListUseCase } from "../../../../application/interfaces/usecase/following/getfollowing-list-usecase.interface"
import { IGetProfileFollowersPreviewUseCase } from "../../../../application/interfaces/usecase/following/get-profile-followers-prview-usecase.interface"
import { ICreatePlayListUseCase } from "../../../../application/interfaces/usecase/playlist/create-playlist-usecase.interface"
import { IGetPlayListUseCase } from "../../../../application/interfaces/usecase/playlist/get-playlist-usecase.interface"
import { IAddToPlayListUseCase } from "../../../../application/interfaces/usecase/playlist/add-to-playlist-usecase.interface"
import { ISearchSongsUseCase } from "../../../../application/interfaces/usecase/song/search-songs-usecaseinterface"
import { IEditPlayListUseCase } from "../../../../application/interfaces/usecase/playlist/edit-playlist-usecase.interface"
import { IUserGetSearchDataUseCase } from "../../../../application/interfaces/usecase/search/user-get-search-data-usecase.interface"
import { IGetUserProfileUseCase } from "../../../../application/interfaces/usecase/user-features/get-user-profile-usecase.interface"
import { IGetUserFriendsUseCase } from "../../../../application/interfaces/usecase/user-features/get-user-friends-uscase.interface"
import { IFetchAllSongsUsecase } from "../../../../application/interfaces/usecase/song/fetch-all-songs-usecase.interface"
import { IFetchAllAlbumsUsecase } from "../../../../application/interfaces/usecase/album/fetch-all-albums-usecase.interface"
import { IGetAllPlaylistUseCase } from "../../../../application/interfaces/usecase/playlist/get-all-playlist-usecase.interface"

export class UserController{
    constructor(
        private readonly _editProfileUserUsecase: IEditProfileUseCase,
        private readonly _changePasswordUsecase: IChangePasswordUsecase,
        private readonly _fetchSongsUsecase: IFetchSongsUsecase,
        private readonly _fetchAlbumsUsecase: IFetchAlbumsUsecase,
        private readonly _songDetailsUsecase: ISongDetailsUseCase,
        private readonly _albumDetailsUsecase: IAlbumDetailsUseCase,
        private readonly _artistDetailsUsecase: IArtistDetailsUseCase,
        private readonly _checkFollowStatusUsecase: ICheckFollowStatusUseCase,
        private readonly _followHandleUsecase: IFollowingHandleUseCase,
        private readonly _followingUsecase: IGetFollowingListUseCase,
        private readonly _createPlayListUsecase: ICreatePlayListUseCase,
        private readonly _getPlayListUsecase: IGetPlayListUseCase,
        private readonly _getAllPlayListUsecase: IGetAllPlaylistUseCase,
        private readonly _addToPlayListUsecase: IAddToPlayListUseCase,
        private readonly _searchSongsUseCase: ISearchSongsUseCase,
        private readonly _editPlauListUsecase: IEditPlayListUseCase,
        private readonly _getUserDetailsUsecase: IGetUserByIdUseCase,
        private readonly _userSearchDataUsecase: IUserGetSearchDataUseCase,
        private readonly _getUserProfileDetailsUsecase: IGetUserProfileUseCase,
        private readonly _userFriendsListsUseCase: IGetUserFriendsUseCase,
        private readonly _fetchAllSongsUsecase: IFetchAllSongsUsecase,
        private readonly _fetchallAlbumsUsecase: IFetchAllAlbumsUsecase,
        private readonly _followersUsecase: IGetProfileFollowersPreviewUseCase,
        private readonly _songHydrationUsecase: ISongHydrationUseCase
        
    ){}

    editProfile = async(req:AuthRequest, res:Response, next: NextFunction) =>{
        try {
            const userId = req.user?.id
            const existingUser = await this._getUserDetailsUsecase.execute(userId!)
            if(!userId || !existingUser){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const existingPublicId = existingUser.profileImagePublicId
            const USER_FOLDER = `/user_profile/${userId}`

            let profileImageUrl : string | undefined;
            let profileImagePublicId : string | undefined
            if(req.file){
                const dataURL = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

                const uploadImageOption : uploadOptionsType ={
                    resource_type: "image",
                    public_id: existingPublicId || undefined,
                    invalidate: true,
                    folder: !existingPublicId ? USER_FOLDER: undefined
                }

                const uploadImage = await cloudinary.uploader.upload(dataURL,uploadImageOption)

                profileImageUrl = uploadImage.secure_url;
                profileImagePublicId = uploadImage.public_id
            }

            const dto : EditProfileRequestDTO = EditProfileSchema.parse({...req.body, profileImage: profileImageUrl}) 
            if(profileImagePublicId) dto.profileImagePublicId = profileImagePublicId

            const result = await this._editProfileUserUsecase.execute(userId,dto)

            return res.status(StatusCode.OK).json({user:result.user,message:MESSAGES.PROFILE_UPDATED})
        } catch (error) {
            next(error)
        }
    }

    changePassword = async(req:AuthRequest, res:Response, next: NextFunction) =>{
        try {
            const userId = req.user?.id
            if(!userId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const dto : ChangePasswordRequestDTO = ChangePasswordSchema.parse(req.body) 
            
            await this._changePasswordUsecase.execute(userId, dto)

            return res.status(StatusCode.OK).json({message: MESSAGES.PASSWORD_UPDATED})
        } catch (error) {
            next(error)
        }
    }

    fetchSongs = async(req:AuthRequest, res:Response, next: NextFunction) =>{
        try {
            if(!req.user?.id){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }
            const songs = await this._fetchSongsUsecase.execute()

            return res.status(StatusCode.OK).json(songs)
        } catch (error) {
            next(error)
        }
    }

    fetchAlbums = async(req:AuthRequest, res:Response, next: NextFunction) =>{
        try {
            if(!req.user?.id){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }
            const songs = await this._fetchAlbumsUsecase.execute()

            return res.status(StatusCode.OK).json(songs)
        } catch (error) {
            next(error)
        }
    }

    songDetails = async(req:AuthRequest, res:Response, next:NextFunction)=>{
        try {
            const userId = req.user?.id
            const songId = req.params.id
            if(!userId || !songId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result =  await this._songDetailsUsecase.execute(songId)

            return res.status(StatusCode.OK).json({songs:result.songs, recomentations:result.recomentations})
        } catch (error) {
            next(error)
        }
    }

     songHydration = async(req:AuthRequest, res:Response, next:NextFunction)=>{
        try {
            const userId = req.user?.id
            const songId = req.params.id
            if(!userId || !songId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result =  await this._songHydrationUsecase.execute(songId)

            return res.status(StatusCode.OK).json({songs:result})
        } catch (error) {
            next(error)
        }
    }

    albumDetails = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const userId = req.user?.id
            const albumId = req.params.id
            if(!userId || !albumId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result = await this._albumDetailsUsecase.execute(albumId)

            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    artistDetails = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const userId = req.user?.id
            const artistId = req.params.id
            if(!userId || !artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result = await this._artistDetailsUsecase.execute(artistId)

            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    checkFollowStatus = async(req: AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const followId = req.user?.id
            const targetId = req.params.targetId
            const role = (req.query.role as "user" | "artist") || "user"

             if(!followId || !targetId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const isFollowing = await this._checkFollowStatusUsecase.execute(followId, targetId, role)

            return res.status(StatusCode.OK).json(isFollowing)

        } catch (error) {
            next(error)
        }
    }

    handleFollow = async(req:AuthRequest, res:Response,next: NextFunction)=>{
        try {
            const followId = req.user?.id
            const {targetId} = req.params
            const role = (req.query.role as 'user' | 'artist') || 'user';
            const action = req.method === "POST" ? "follow" : "unfollow"
            if(!followId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            await this._followHandleUsecase.execute(followId,targetId,role,action)

            return res.status(StatusCode.OK).json({ message: `Successfully ${action}ed ${role}` })
        } catch (error) {
            next(error)
        }
    }

    following = async(req: AuthRequest, res: Response, next:NextFunction)=>{
        try {
            const userId = req.user?.id
            if(!userId ){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6; 

            const following = await this._followingUsecase.execute(userId, page, limit)

            return res.status(StatusCode.OK).json(following)
        } catch (error) {
            next(error)
        }
    }

    followers = async(req: AuthRequest, res: Response, next:NextFunction)=>{
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6; 

            const result = await this._followersUsecase.execute(userId, page, limit);
            
            return res.status(StatusCode.OK).json(result);
        } catch (error) {
            next(error)
        }
    }

    createPlayList = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const userId = req.user?.id
            if(!userId ){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const playlist = await this._createPlayListUsecase.execute(userId)
            return res.status(StatusCode.CREATED).json(playlist)
        } catch (error) {
            next(error)
        }
    }

    getPlayList = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const userId = req.user?.id
            const playListId = req.params.playListId
            if(!userId || !playListId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const playlist = await this._getPlayListUsecase.execute(playListId)

            return res.status(StatusCode.OK).json(playlist)
        } catch (error) {
            next(error)
        }
    }

    getAllPlaylists = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const userId = req.user?.id
            if(!userId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const plalists = await this._getAllPlayListUsecase.execute(userId)

            return res.status(StatusCode.OK).json(plalists)
        } catch (error) {
            next(error)
        }
    }

    addToPlayList = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const userId = req.user?.id
            const playListId = req.params.playListId
            const {songId} = req.body
            if(!userId || !playListId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result = await this._addToPlayListUsecase.execute(playListId,songId)

            return res.status(StatusCode.CREATED).json({message: "song added to playlist"})
        } catch (error) {
            next(error)
        }
    }

    searchSongs = async (req: Request, res: Response, next: NextFunction) => {
        try {
        const query = String(req.query.q || "");
        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        const offset = req.query.offset ? Number(req.query.offset) : undefined;

        const songs = await this._searchSongsUseCase.execute({
            query,
            limit,
            offset,
        });


        res.status(StatusCode.OK).json(songs);
        } catch (error) {
        next(error)
        }
    };

    editPlayList = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const playListId = req.params.playListId;
            const updateData = req.body; 

            const existingPlaylist = await this._getPlayListUsecase.execute(playListId)
            if (!existingPlaylist) {
                return res.status(404).json({ message: "Playlist not found" });
            }
            // Get the full public ID path from the database
            let existingPublicId = existingPlaylist.coverImagePublicId;
           const PLAYLIST_FOLDER = `/playList/${playListId}`

            if(req.file){
                const dataURL = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
                const editOption : uploadOptionsType={
                    resource_type:"image",
                    public_id: existingPublicId,
                    invalidate: true,
                    folder: !existingPublicId ? PLAYLIST_FOLDER : undefined
                }
                const imageUpload = await cloudinary.uploader.upload(dataURL, editOption)

                updateData.coverImageUrl = imageUpload.secure_url; 
                updateData.coverImagePublicId= imageUpload.public_id
            }
            const result = await this._editPlauListUsecase.execute(playListId, updateData);

            return res.status(StatusCode.OK).json({message: "Playlist updated successfully", data: result});
        } catch (error) {
            next(error);
        }
    }

    searchDiscover = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const query = String(req.query.q)

            const searchResult = await this._userSearchDataUsecase.execute(query)
            return res.status(StatusCode.OK).json(searchResult)
        } catch (error) {
            next(error)
        }
    }

    userDetails = async(req:AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const userId = req.params.userId
            if(!userId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }
            const userDetails = await this._getUserProfileDetailsUsecase.execute(userId)
             return res.status(StatusCode.OK).json(userDetails)
        } catch (error) {
            next(error)
        }
    }

    friends = async(req: AuthRequest, res:Response, next:NextFunction)=>{
        try {
            const userId = req.user?.id
            if(!userId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const friends = await this._userFriendsListsUseCase.execute(userId)

            return res.status(StatusCode.OK).json(friends)
        } catch (error) {
            next(error)
        }
    }

    allSongs = async (req: AuthRequest, res: Response, next: NextFunction) => {
        
        try {
            if (!req.user?.id) {
                return res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const search = req.query.q as string;

            const result = await this._fetchAllSongsUsecase.execute(page, limit, search);
        
            return res.status(StatusCode.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    allAlbums = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                return res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const search = req.query.q as string;

            const result = await this._fetchallAlbumsUsecase.execute(page, limit, search);
 
            return res.status(StatusCode.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
}