import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../middleware/authMiddleware";
import { StatusCode } from "../../../../common/status.enum";
import { MESSAGES } from "../../../../common/constants.message";
import { ArtistEditProfileUsecase } from "../../../../usecases/artist/artistEditProfile.useCase";
import { EditProfileRequestDTO } from "../../../../usecases/dto/profile/profile.dto";
import { EditProfileSchema } from "../../validators/profile/profile.validators";

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

            const dto : EditProfileRequestDTO = EditProfileSchema.parse({...req.body, profileImage: profileImageUrl}) 
            const result = await this.artistEditProfileUsecase.execute(userId,dto)

            return res.status(StatusCode.OK).json({user:result.user,message:MESSAGES.ARTIST_UPDATED})            
        } catch (error) {
            next(error)
        }
    }
}