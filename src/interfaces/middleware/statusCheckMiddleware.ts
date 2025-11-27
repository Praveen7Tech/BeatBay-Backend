import { NextFunction, RequestHandler, Response } from "express";
import { AuthRequest } from "./authMiddleware";
import { StatusCode } from "../../common/constants/status.enum";
import { MESSAGES } from "../../common/constants/constants.message";
import { MongooseUserRepository } from "../../infrastructure/presistence/mongoose/repositories/mongoose.user.repository";

const userRepository = new MongooseUserRepository();

export const statusCheckMiddleware : RequestHandler = async(req: AuthRequest, res: Response, next: NextFunction)=>{
    if(!req.user?.id){
        return res.status(StatusCode.UNAUTHORIZED).json(MESSAGES.UNAUTHORIZED)
    }
    try {
        const user = await userRepository.findById(req.user.id)
        if(!user || !user.status){
            return res.status(StatusCode.FORBIDDEN).json({message: "Your account account has been blocked By an administrator!"})
        }

        next()
    } catch (error) {
        console.error("Error in user status check", error)
         return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error." });
    }
}