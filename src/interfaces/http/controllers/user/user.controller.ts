import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../../common/constants/status.enum"
import { MESSAGES } from "../../../../common/constants/constants.message"
import { editProfileUsecase } from "../../../../usecases/user/editProfile.useCase"
import { AuthRequest } from "../../../middleware/authMiddleware"
import { EditProfileRequestDTO } from "../../../../usecases/dto/profile/profile.dto"
import { EditProfileSchema } from "../../validators/profile/profile.validators"

export class UserController{
    constructor(
        private readonly editProfileUserUsecase: editProfileUsecase
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
}