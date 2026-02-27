import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../middleware/auth/authMiddleware";
import { StatusCode } from "../../../../common/constants/status.enum";
import { MESSAGES } from "../../../../common/constants/constants.message";
import { IFetchAllUsersUseCase } from "../../../../application/interfaces/usecase/admin/fetch-all-users-usecase.interface";
import { IGetUserByIdUseCase } from "../../../../application/interfaces/usecase/user-features/get-userbyid-usecase.interface";
import { IBlockUserUseCase } from "../../../../application/interfaces/usecase/admin/block-user-usecase.interface";
import { IUnBlockUserUseCase } from "../../../../application/interfaces/usecase/admin/unblock-user-usecase.interface";
import { IFetchAllArtistsUseCase } from "../../../../application/interfaces/usecase/admin/fetchall-artist-usecase.interface";
import { IGetArtistByIdUseCase } from "../../../../application/interfaces/usecase/artist-features/get-artist-byid-usecase.interface";
import { IBlockArtistUseCase } from "../../../../application/interfaces/usecase/admin/block-artist-usecase.interface";
import { IUnBlockArtistUseCase } from "../../../../application/interfaces/usecase/admin/unblock-artist-usecase.interface";
import { IGetAdminDashBoardDataUseCase } from "../../../../application/interfaces/usecase/admin/get-admin-dashboard-usecase.interface";
import { IGetAllSongsUseCase } from "../../../../application/interfaces/usecase/admin/get-all-song-usecse.interface";
import { IAdminGetSongDetailsByIdUseCase } from "../../../../application/interfaces/usecase/admin/get-songdetails-byid-usecase.interface";
import { IToggleSongStatusUseCase } from "../../../../application/interfaces/usecase/admin/toggle-song-status-usecase.interface";
import { IAdminGetAllAlbumsUseCase } from "../../../../application/interfaces/usecase/admin/get-all-albums-usecase.interface";
import { IAdminGetAlbumDetailsByIdUseCase } from "../../../../application/interfaces/usecase/admin/get-album-details-byid-usecase.interface";
import { IToggleAlbumStatusUseCase } from "../../../../application/interfaces/usecase/admin/toggle-album-status-usecase.interface";
import { IDashBoardDemographicsUseCase } from "../../../../application/interfaces/usecase/admin/dashboard/dahsboard-demographics-usecase.interface";
import { IDashBoardEntityBreakDownUseCase } from "../../../../application/interfaces/usecase/admin/dashboard/entity-breakdown-usecase.interface";
import { SortType } from "../../../../domain/interfaces/songRequest";
import { IRevenueDashBoardStatsUseCase } from "../../../../application/interfaces/usecase/admin/revenue/revenue-dashboard-stats-usecase.interface";
import { IRevenueDashBoardChartUseCase, RevenueRange } from "../../../../application/interfaces/usecase/admin/revenue/revenue-dashboardDetails-usecase.interface";
import { IRevenuePayoutHistoryUseCase } from "../../../../application/interfaces/usecase/admin/revenue/revenue-payout-history-usecase.interface";

export class AdminFeaturesController{
    constructor(
        private readonly _adminFetchAllUsers: IFetchAllUsersUseCase,
        private readonly _adminGetUserByIdUsecase: IGetUserByIdUseCase,
        private readonly _adminBlockUserUsecase: IBlockUserUseCase,
        private readonly _adminUnBlockUserUsecase: IUnBlockUserUseCase,
        private readonly _adminFetchAllArtists: IFetchAllArtistsUseCase,
        private readonly _adminGetArtistByIdUsecase: IGetArtistByIdUseCase,
        private readonly _adminBlockArtistUsecase: IBlockArtistUseCase,
        private readonly _adminUnBlockArtistUsecase: IUnBlockArtistUseCase,
        private readonly _adminGetDashBoardData: IGetAdminDashBoardDataUseCase,
        private readonly _adminGetAllSongsUsecase: IGetAllSongsUseCase,
        private readonly _getSongDetailsUseCase: IAdminGetSongDetailsByIdUseCase,
        private readonly _toggleBlockStatusUseCase:IToggleSongStatusUseCase,
        private readonly _adminGetAllAlbumsUsecase: IAdminGetAllAlbumsUseCase,
        private readonly _getAlbumDetailsUseCase: IAdminGetAlbumDetailsByIdUseCase,
        private readonly _toggleAlbumStatusUseCase: IToggleAlbumStatusUseCase,
        private readonly _dashBoardDemographicsUsecase : IDashBoardDemographicsUseCase,
        private readonly _dashBoardEntityBreakDownUseCase: IDashBoardEntityBreakDownUseCase,
        private readonly _revenueDashbaordStatistics: IRevenueDashBoardStatsUseCase,
        private readonly _revenueDashboardChartUsecase: IRevenueDashBoardChartUseCase,
        private readonly _revenuePayoutHistoryUsecase: IRevenuePayoutHistoryUseCase
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
                sort: sort as SortType
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
                sort: sort as SortType
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

             await this._toggleAlbumStatusUseCase.execute(id, status);
            
            return res.status(StatusCode.OK).json({
            success: true,
            message: `Album successfully ${!status ? 'blocked' : 'unblocked'}`,
            });
        } catch (error) {
            next(error);
        }
    }

    demographics = async(req:AuthRequest, res:Response, next:NextFunction)=>{
        try {
            const entity = req.query.entity as string;
            const range = req.query.range as string;

            if(!entity || !range){
                return res.status(StatusCode.BAD_REQUEST).json("invalid entiry or range")
            }

            const data = await this._dashBoardDemographicsUsecase.execute(entity, range)

            return res.status(StatusCode.OK).json(data)
        } catch (error) {
            next(error)
        }
    }

    entityBreakDown = async(req:AuthRequest, res:Response, next:NextFunction)=>{
        try {
            const data = await this._dashBoardEntityBreakDownUseCase.execute()

            return res.status(StatusCode.OK).json(data)
        } catch (error) {
            next(error)
        }
    }

    revenueDashboard = async(req:AuthRequest, res:Response, next:NextFunction)=>{
        try {
            const adminId = req.user?.id
            if(!adminId){
                return res.status(StatusCode.NOT_FOUND).json(MESSAGES.UNAUTHORIZED)
            }
            
            const status = await this._revenueDashbaordStatistics.execute()
console.log("stats ", status)
            return res.status(StatusCode.OK).json(status)
        } catch (error) {
            next(error)
        }
    }

    getRevenueChart = async(req:AuthRequest, res:Response,next:NextFunction)=>{
        try {
            const range = (req.query.range as RevenueRange) || "monthly";
            if(!range){
                return res.status(StatusCode.BAD_REQUEST).json("invalid entiry or range")
            }

            const result = await this._revenueDashboardChartUsecase.execute(range)
    console.log("chart ", result)        
            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    getPayoutHistory = async (req: AuthRequest,res: Response,next: NextFunction) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;

            const result = await this._revenuePayoutHistoryUsecase.execute(page, limit);

            return res.status(StatusCode.OK).json(result);
        } catch (error) {
            next(error);
        }
    };
}