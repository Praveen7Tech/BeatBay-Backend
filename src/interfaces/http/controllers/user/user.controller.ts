import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../../common/status.enum"
import { MESSAGES } from "../../../../common/constants.message"

export class UserController{
    constructor(){}

   editProfile = async(req:Request, res:Response, next: NextFunction) =>{
        try {
            
            return res.status(StatusCode.OK).json({message:MESSAGES.OTP_SEND})
        } catch (error) {
            next(error)
        }
    }
}