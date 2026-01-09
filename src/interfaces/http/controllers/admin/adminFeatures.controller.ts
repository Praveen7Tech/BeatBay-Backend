import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../middleware/auth/authMiddleware";
import { StatusCode } from "../../../../common/constants/status.enum";
import { FetchAllUsersUseCase } from "../../../../usecases/admin/users/adminFetchAllUsers.useCase";
import { MESSAGES } from "../../../../common/constants/constants.message";
import { GetUserByIdUseCase } from "../../../../usecases/admin/users/adminGetUserById.useCase";
import { BlockUserUseCase } from "../../../../usecases/admin/users/adminBlockUser.useCase";
import { UnBlockUserUseCase } from "../../../../usecases/admin/users/adminUnBlockUser.useCase";
import { FetchAllArtistsUseCase } from "../../../../usecases/admin/artists/adminFetchAllArtists.useCase";
import { GetArtistByIdUseCase } from "../../../../usecases/admin/artists/adminGetArtistById.useCase";
import { BlockArtistUseCase } from "../../../../usecases/admin/artists/adminBlockArtist.useCase";
import { UnBlockUArtistUseCase } from "../../../../usecases/admin/artists/adminUnBlockArtist.useCase";
import { GetAdminDashBoardData } from "../../../../usecases/admin/dashboard/adminGetDashboardData";
import { GetAllSongsUseCase } from "../../../../usecases/admin/songs/adminGetAllSong.Usecase";
import { ToggleSongStatusUseCase } from "../../../../usecases/admin/songs/adminUpdateSongStatus.UseCase";
import { AdminGetSongDetailsByIdUseCase } from "../../../../usecases/admin/songs/adminGetSongDetails.UseCase";
import { AdminGetAllAlbumsUseCase } from "../../../../usecases/admin/album/adminGetAllAlbums.Usecase";
import { AdminGetAlbumDetailsByIdUseCase } from "../../../../usecases/admin/album/adminGetAlbumDetails.UseCase";
import { ToggleAlbumStatusUseCase } from "../../../../usecases/admin/album/adminUpdateAlbumStatus.UseCase";

export class AdminFeaturesController{
    constructor(
        private readonly _adminFetchAllUsers:FetchAllUsersUseCase,
        private readonly _adminGetUserByIdUsecase: GetUserByIdUseCase,
        private readonly _adminBlockUserUsecase: BlockUserUseCase,
        private readonly _adminUnBlockUserUsecase: UnBlockUserUseCase,
        private readonly _adminFetchAllArtists: FetchAllArtistsUseCase,
        private readonly _adminGetArtistByIdUsecase: GetArtistByIdUseCase,
        private readonly _adminBlockArtistUsecase: BlockArtistUseCase,
        private readonly _adminUnBlockArtistUsecase: UnBlockUArtistUseCase,
        private readonly _adminGetDashBoardData: GetAdminDashBoardData,
        private readonly _adminGetAllSongsUsecase:GetAllSongsUseCase,
        private readonly _getSongDetailsUseCase: AdminGetSongDetailsByIdUseCase,
        private readonly _toggleBlockStatusUseCase:ToggleSongStatusUseCase,
        private readonly _adminGetAllAlbumsUsecase: AdminGetAllAlbumsUseCase,
        private readonly _getAlbumDetailsUseCase: AdminGetAlbumDetailsByIdUseCase,
        private readonly _toggleAlbumStatusUseCase: ToggleAlbumStatusUseCase
    ){}

    getAllUser = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 5
            const search = String(req.query.search) || ""

            const users = await this._adminFetchAllUsers.execute(page, limit, search)
            return res.status(StatusCode.OK).json(users)
        } catch (error) {
            next(error)
        }
    }

    getUserById = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const userId = req.params.userId
             if(!userId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const user = await this._adminGetUserByIdUsecase.execute(userId)

            return res.status(StatusCode.OK).json(user)
        } catch (error) {
            next(error)
        }
    }

    blockUser = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const userId = req.params.userId
            if(!userId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result = await this._adminBlockUserUsecase.execute(userId)

            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    unBlockUser = async(req: AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const userId = req.params.userId
            if(!userId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result = await this._adminUnBlockUserUsecase.execute(userId)
            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    getAllArtists = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 5
            const search = String(req.query.search) || ""

            const users = await this._adminFetchAllArtists.execute(page, limit, search)
            return res.status(StatusCode.OK).json(users)
        } catch (error) {
            next(error)
        }
    }

    getArtistById = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const artistId = req.params.artistId
             if(!artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const user = await this._adminGetArtistByIdUsecase.execute(artistId)

            return res.status(StatusCode.OK).json(user)
        } catch (error) {
            next(error)
        }
    }  
    
    blockArtist = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const artistId = req.params.artistId
            if(!artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result = await this._adminBlockArtistUsecase.execute(artistId)

            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    unBlockArtist = async(req: AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const artistId = req.params.artistId
            if(!artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result = await this._adminUnBlockArtistUsecase.execute(artistId)
            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    getDadhBoradDara = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const adminId = req.user?.id
            if(!adminId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const data  =  await this._adminGetDashBoardData.execute()
            return res.status(StatusCode.OK).json(data)
        } catch (error) {
            next(error)
        }
    }

    getAllSongs = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const adminId = req.user?.id;
            if (!adminId) {
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            // Extract query params from the URL
            const { page, limit, search, status, genre, sort } = req.query;

            const result = await this._adminGetAllSongsUsecase.execute({
                page: Number(page) || 1,
                limit: Number(limit) || 10,
                search: search as string,
                status: status as string,
                genre: genre as string,
                sort: sort as any
            });

            return res.status(StatusCode.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    getSongDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }
            const song = await this._getSongDetailsUseCase.execute(id);
            
            return res.status(StatusCode.OK).json({ success: true, data: song });
        } catch (error) {
            next(error);
        }
    }

    toggleSongBlockStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { isBlocked } = req.body; 

            const updatedSong = await this._toggleBlockStatusUseCase.execute(id, isBlocked);
            
            return res.status(StatusCode.OK).json({
            success: true,
            message: `Song successfully ${isBlocked ? 'blocked' : 'unblocked'}`,
            data: updatedSong
            });
        } catch (error) {
            next(error);
        }
    }

    getAllAlbums = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const adminId = req.user?.id;
            if (!adminId) {
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const { page, limit, search, status, sort } = req.query;

            const result = await this._adminGetAllAlbumsUsecase.execute({
                page: Number(page) || 1,
                limit: Number(limit) || 10,
                search: search as string,
                status: status as string,
                sort: sort as any
            });

            return res.status(StatusCode.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    getAlbumDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }
            const album = await this._getAlbumDetailsUseCase.execute(id);
            
            return res.status(StatusCode.OK).json({ success: true, data: album });
        } catch (error) {
            next(error);
        }
    }

    toggleAlbumBlockStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status } = req.body; 
            console.log("here we ", id, status)

            const updatedSong = await this._toggleAlbumStatusUseCase.execute(id, status);
            
            return res.status(StatusCode.OK).json({
            success: true,
            message: `Song successfully ${!status ? 'blocked' : 'unblocked'}`,
            });
        } catch (error) {
            next(error);
        }
    }
}