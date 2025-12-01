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

export class AdminFeaturesController{
    constructor(
        private readonly adminFetchAllUsers:FetchAllUsersUseCase,
        private readonly adminGetUserByIdUsecase: GetUserByIdUseCase,
        private readonly adminBlockUserUsecase: BlockUserUseCase,
        private readonly adminUnBlockUserUsecase: UnBlockUserUseCase,
        private readonly adminFetchAllArtists: FetchAllArtistsUseCase,
        private readonly adminGetArtistByIdUsecase: GetArtistByIdUseCase,
        private readonly adminBlockArtistUsecase: BlockArtistUseCase,
        private readonly adminUnBlockArtistUsecase: UnBlockUArtistUseCase,
        private readonly adminGetDashBoardData: GetAdminDashBoardData
    ){}

    getAllUser = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 5
            const search = String(req.query.search) || ""

            const users = await this.adminFetchAllUsers.execute(page, limit, search)
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

            const user = await this.adminGetUserByIdUsecase.execute(userId)

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

            const result = await this.adminBlockUserUsecase.execute(userId)

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

            const result = await this.adminUnBlockUserUsecase.execute(userId)
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

            const users = await this.adminFetchAllArtists.execute(page, limit, search)
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

            const user = await this.adminGetArtistByIdUsecase.execute(artistId)

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

            const result = await this.adminBlockArtistUsecase.execute(artistId)

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

            const result = await this.adminUnBlockArtistUsecase.execute(artistId)
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

            const data  =  await this.adminGetDashBoardData.execute()
            return res.status(StatusCode.OK).json(data)
        } catch (error) {
            next(error)
        }
    }
}