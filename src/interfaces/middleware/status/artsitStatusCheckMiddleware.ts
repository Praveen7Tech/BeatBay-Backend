import { NextFunction, RequestHandler, Response } from "express";
import { AuthRequest } from "../auth/authMiddleware"; 
import { StatusCode } from "../../../common/constants/status.enum"; 
import { MESSAGES } from "../../../common/constants/constants.message"; 
import { MongooseArtistRepository } from "../../../infrastructure/presistence/mongoose/repositories/mongoose.artist.repository"; 

const artistRepository = new MongooseArtistRepository()

export const ArtistStatusCheckMiddleware : RequestHandler = async(req: AuthRequest, res: Response, next: NextFunction)=>{
    if(!req.user?.id){
        return res.status(StatusCode.UNAUTHORIZED).json(MESSAGES.UNAUTHORIZED)
    }
    try {
        const user = await artistRepository.findById(req.user.id)
        if(!user || !user.status){
            return res.status(StatusCode.FORBIDDEN).json({message: "Your account account has been blocked By an administrator!"})
        }

        next()
    } catch (error) {
        console.error("Error in user status check", error)
         return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error." });
    }
}