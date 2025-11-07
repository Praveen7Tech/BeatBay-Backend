import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../middleware/authMiddleware";
import { StatusCode } from "../../../../common/constants/status.enum";
import { MESSAGES } from "../../../../common/constants/constants.message";
import { ArtistEditProfileUsecase } from "../../../../usecases/artist/artistEditProfile.useCase";
import { EditProfileRequestDTO } from "../../../../usecases/dto/profile/profile.dto";
import { EditProfileSchema } from "../../validators/profile/profile.validators";
import { ResetPasswordDTO, VerifyEmailRequestDTO } from "../../../../usecases/dto/auth/request.dto";
import { ResetPassRequestSchema, VerifyEmailRequestSchema } from "../../validators/auth/auth.validator";
import { ArtistVerifyEmailUsecase } from "../../../../usecases/artist/artistVerifyEmail.useCase";
import { ArtistResetPasswordUsecase } from "../../../../usecases/artist/artistResetPassword.useCase";

export class ArtistController {
    constructor(
        private readonly artistEditProfileUsecase:ArtistEditProfileUsecase,
        private readonly artistVerifyEmailUsecase: ArtistVerifyEmailUsecase,
        private readonly artistResetPasswordUsecase: ArtistResetPasswordUsecase
    ){}

    editProfile = async(req:AuthRequest, res:Response, next: NextFunction)=>{
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
            const result = await this.artistEditProfileUsecase.execute(userId,dto)

            return res.status(StatusCode.OK).json({user:result.user,message:MESSAGES.PROFILE_UPDATED})            
        } catch (error) {
            next(error)
        }
    }

    verifyEmail = async(req: Request, res:Response, next: NextFunction)=>{
        try {
            const dto : VerifyEmailRequestDTO = VerifyEmailRequestSchema.parse(req.body)
            await this.artistVerifyEmailUsecase.execute(dto)
            return res.status(StatusCode.CREATED).json({message:MESSAGES.PASSWORD_RESET_LINK})            
        } catch (error) {
            next(error)
        }
    }

    resetPassword= async(req:Request, res:Response, next: NextFunction)=>{
        
        try {
        const {password, token} = req.body

        const dto : ResetPasswordDTO = ResetPassRequestSchema.parse({token,password})

        await this.artistResetPasswordUsecase.execute(dto)
        
        return res.status(StatusCode.OK).json({message:MESSAGES.REST_PASSWORD_SUCCESS})
        } catch (error) {
        next(error)
        }
    }    
}