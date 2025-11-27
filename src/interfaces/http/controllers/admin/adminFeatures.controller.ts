import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../middleware/authMiddleware";
import { StatusCode } from "../../../../common/constants/status.enum";
import { FetchAllUsersUseCase } from "../../../../usecases/admin/users/adminFetchAllUsers.useCase";
import { MESSAGES } from "../../../../common/constants/constants.message";
import { GetUserByIdUseCase } from "../../../../usecases/admin/users/adminGetUserById.useCase";
import { BlockUserUseCase } from "../../../../usecases/admin/users/adminBlockUser.useCase";

export class AdminFeaturesController{
    constructor(
        private readonly adminFetchAllUsers:FetchAllUsersUseCase,
        private readonly adminGetUserByIdUsecase: GetUserByIdUseCase,
        private readonly adminBlockUserUsecase: BlockUserUseCase
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
}