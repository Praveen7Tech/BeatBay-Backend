import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../middleware/authMiddleware";
import { StatusCode } from "../../../../common/status.enum";
import { MESSAGES } from "../../../../common/constants.message";
import { EditProfileRequest, EditProfileSchema } from "../../../../usecases/auth/dto/request.dto";
import { ArtistEditProfileUsecase } from "../../../../usecases/artist/artistEditProfile.useCase";

export class ArtistController {
    constructor(
        private readonly artistEditProfileUsecase:ArtistEditProfileUsecase
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

            const dto : EditProfileRequest = EditProfileSchema.parse({...req.body, profileImage: profileImageUrl}) 
            const result = await this.artistEditProfileUsecase.execute(userId,dto)

            return res.status(StatusCode.OK).json({user:result.user,accessToken:result.accessToken,message:MESSAGES.ARTIST_UPDATED})            
        } catch (error) {
            next(error)
        }
    }
}