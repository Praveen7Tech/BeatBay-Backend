import { NextFunction, Request, response, Response } from "express"
import { StatusCode } from "../../../../common/constants/status.enum"
import { MESSAGES } from "../../../../common/constants/constants.message"
import { editProfileUsecase } from "../../../../usecases/user/profile/editProfile.useCase" 
import { AuthRequest } from "../../../middleware/auth/authMiddleware"
import { ChangePasswordRequestDTO, EditProfileRequestDTO } from "../../../../usecases/dto/profile/profile.dto"
import { ChangePasswordSchema, EditProfileSchema } from "../../validators/profile/profile.validators"
import { ChangePasswordUsecase } from "../../../../usecases/user/profile/changePassword.useCase"
import { FetchSongsUsecase } from "../../../../usecases/user/song/fetchSongs.useCase"
import { FetchAlbumsUsecase } from "../../../../usecases/user/album/fetchAlbums.useCase"
import { SongDetailsUseCase } from "../../../../usecases/user/song/songDetails.useCase"
import { AlbumDetailsUseCase } from "../../../../usecases/user/album/albumDetails.useCase"
import { ArtistDetailsUseCase } from "../../../../usecases/user/artist/artistDeatils.useCase"
import { CheckFollowStatusUseCase } from "../../../../usecases/user/follow/checkFollowStatus.useCase"
import { FollowArtistUseCase } from "../../../../usecases/user/follow/followArtist.useCase"
import { UnfollowArtistUseCase } from "../../../../usecases/user/follow/unFollowArtist.useCase"
import { GetFollowingListUseCase } from "../../../../usecases/user/follow/following.useCase"
import { CreatePlayListUseCase } from "../../../../usecases/user/playList/createPlayList.useCase"
import { GetPlayListUseCase } from "../../../../usecases/user/playList/getPlayList.useCase"
import { GetAllPlaylistUseCase } from "../../../../usecases/user/playList/getAllPlaylist.useCase"
import { AddToPlayListUseCase } from "../../../../usecases/user/playList/addToPlayList.useCase"
import { SearchSongsUseCase } from "../../../../usecases/user/song/searchSong.useCase"
import { EditPlayListUseCase } from "../../../../usecases/user/playList/editPlayList.useCase"
import cloudinary from "../../../../infrastructure/config/cloudinary"
import { GetUserByIdUseCase } from "../../../../usecases/admin/users/adminGetUserById.useCase"
import { uploadOptionsType } from "../../../../infrastructure/config/cloudinary"
import { UserGetSearchDataUseCase } from "../../../../usecases/user/search/searchData.useCase"

export class UserController{
    constructor(
        private readonly editProfileUserUsecase: editProfileUsecase,
        private readonly changePasswordUsecase: ChangePasswordUsecase,
        private readonly fetchSongsUsecase: FetchSongsUsecase,
        private readonly fetchAlbumsUsecase: FetchAlbumsUsecase,
        private readonly songDetailsUsecase: SongDetailsUseCase,
        private readonly albumDetailsUsecase: AlbumDetailsUseCase,
        private readonly artistDetailsUsecase: ArtistDetailsUseCase,
        private readonly checkFollowStatusUsecase:CheckFollowStatusUseCase,
        private readonly followArtistUsecase:FollowArtistUseCase,
        private readonly unfollowArtistUsecase: UnfollowArtistUseCase,
        private readonly followingUsecase: GetFollowingListUseCase,
        private readonly createPlayListUsecase: CreatePlayListUseCase,
        private readonly getPlayListUsecase: GetPlayListUseCase,
        private readonly getAllPlayListUsecase: GetAllPlaylistUseCase,
        private readonly addToPlayListUsecase: AddToPlayListUseCase,
        private readonly searchSongsUseCase: SearchSongsUseCase,
        private readonly editPlauListUsecase: EditPlayListUseCase,
        private readonly getUserDetailsUsecase: GetUserByIdUseCase,
        private readonly userSearchDataUsecase: UserGetSearchDataUseCase
        
    ){}

    editProfile = async(req:AuthRequest, res:Response, next: NextFunction) =>{
        try {
            const userId = req.user?.id
            const existingUser = await this.getUserDetailsUsecase.execute(userId!)
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

            const result = await this.editProfileUserUsecase.execute(userId,dto)

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
            
            await this.changePasswordUsecase.execute(userId, dto)

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
            const songs = await this.fetchSongsUsecase.execute()

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
            const songs = await this.fetchAlbumsUsecase.execute()

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

            const result =  await this.songDetailsUsecase.execute(songId)

            return res.status(StatusCode.OK).json({songs:result.songs, recomentations:result.recomentations})
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

            const result = await this.albumDetailsUsecase.execute(albumId)

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

            const result = await this.artistDetailsUsecase.execute(artistId)

            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    checkFollowStatus = async(req: AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const userId = req.user?.id
            const artistId = req.params.artistId

             if(!userId || !artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const isFollowing = await this.checkFollowStatusUsecase.execute(userId, artistId)

            return res.status(StatusCode.OK).json(isFollowing)

        } catch (error) {
            next(error)
        }
    }

    followArtist = async(req: AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const userId = req.user?.id
            const artistId = req.params.artistId

             if(!userId || !artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const follow = await this.followArtistUsecase.execute(userId, artistId)
            return res.status(StatusCode.OK).json({message: "Artist followed successfully"})

        } catch (error) {
            next(error)
        }
    }

    unFollowArtist = async(req: AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const userId = req.user?.id
            const artistId = req.params.artistId

             if(!userId || !artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const unfollow = await this.unfollowArtistUsecase.execute(userId, artistId)
            return res.status(StatusCode.OK).json({message: "Unfollow Artist successfull."})

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

            const following = await this.followingUsecase.execute(userId)

            return res.status(StatusCode.OK).json(following)
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

            const playlist = await this.createPlayListUsecase.execute(userId)
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

            const playlist = await this.getPlayListUsecase.execute(playListId)

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

            const plalists = await this.getAllPlayListUsecase.execute(userId)

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

            const result = await this.addToPlayListUsecase.execute(playListId,songId)

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

      const songs = await this.searchSongsUseCase.execute({
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

            const existingPlaylist = await this.getPlayListUsecase.execute(playListId)
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
            const result = await this.editPlauListUsecase.execute(playListId, updateData);

            return res.status(StatusCode.OK).json({message: "Playlist updated successfully", data: result});
        } catch (error) {
            next(error);
        }
    }

    searchDiscover = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const query = String(req.query.q)

            const searchResult = await this.userSearchDataUsecase.execute(query)
            console.log("search ", searchResult)
            return res.status(StatusCode.OK).json(searchResult)
        } catch (error) {
            next(error)
        }
    }
}