import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../../common/constants/status.enum"
import { MESSAGES } from "../../../../common/constants/constants.message"
import { editProfileUsecase } from "../../../../usecases/user/editProfile.useCase"
import { AuthRequest } from "../../../middleware/authMiddleware"
import { ChangePasswordRequestDTO, EditProfileRequestDTO } from "../../../../usecases/dto/profile/profile.dto"
import { ChangePasswordSchema, EditProfileSchema } from "../../validators/profile/profile.validators"
import { ChangePasswordUsecase } from "../../../../usecases/user/changePassword.useCase"
import { FetchSongsUsecase } from "../../../../usecases/user/fetchSongs.useCase"
import { FetchAlbumsUsecase } from "../../../../usecases/user/fetchAlbums.useCase"

export class UserController{
    constructor(
        private readonly editProfileUserUsecase: editProfileUsecase,
        private readonly changePasswordUsecase: ChangePasswordUsecase,
        private readonly fetchSongsUsecase: FetchSongsUsecase,
        private readonly fetchAlbumsUsecase: FetchAlbumsUsecase
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
}