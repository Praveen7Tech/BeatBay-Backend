import { NextFunction, Request, response, Response } from "express"
import { StatusCode } from "../../../../common/constants/status.enum"
import { MESSAGES } from "../../../../common/constants/constants.message"
import { editProfileUsecase } from "../../../../usecases/user/editProfile.useCase"
import { AuthRequest } from "../../../middleware/authMiddleware"
import { ChangePasswordRequestDTO, EditProfileRequestDTO } from "../../../../usecases/dto/profile/profile.dto"
import { ChangePasswordSchema, EditProfileSchema } from "../../validators/profile/profile.validators"
import { ChangePasswordUsecase } from "../../../../usecases/user/changePassword.useCase"
import { FetchSongsUsecase } from "../../../../usecases/user/fetchSongs.useCase"
import { FetchAlbumsUsecase } from "../../../../usecases/user/fetchAlbums.useCase"
import { SongDetailsUseCase } from "../../../../usecases/user/song/songDetails.useCase"
import { AlbumDetailsUseCase } from "../../../../usecases/user/album/albumDetails.useCase"
import { ArtistDetailsUseCase } from "../../../../usecases/user/artist/artistDeatils.useCase"
import { CheckFollowStatusUseCase } from "../../../../usecases/user/artist/checkFollowStatus.useCase"
import { FollowArtistUseCase } from "../../../../usecases/user/artist/followArtist.useCase"
import { UnfollowArtistUseCase } from "../../../../usecases/user/artist/unFollowArtist.useCase"
import { GetFollowingListUseCase } from "../../../../usecases/user/follow/following.useCase"
import { CreatePlayListUseCase } from "../../../../usecases/user/playList/createPlayList.useCase"
import { GetPlayListUseCase } from "../../../../usecases/user/playList/getPlayList.useCase"
import { GetAllPlaylistUseCase } from "../../../../usecases/user/playList/getAllPlaylist.useCase"
import { AddToPlayListUseCase } from "../../../../usecases/user/playList/addToPlayList.useCase"
import { SearchSongsUseCase } from "../../../../usecases/user/song/searchSong.useCase"

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
        private readonly searchSongsUseCase: SearchSongsUseCase
        
    ){}

    editProfile = async(req:AuthRequest, res:Response, next: NextFunction) =>{
        try {
            const userId = req.user?.id
            if(!userId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            let profileImageUrl : string | undefined;
            if(req.file){
                profileImageUrl = `${req.file.filename}`
            }

            const dto : EditProfileRequestDTO = EditProfileSchema.parse({...req.body, profileImage: profileImageUrl}) 
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

      console.log("songy", songs)

      res.status(StatusCode.OK).json(songs);
    } catch (error) {
      next(error)
    }
  };
}