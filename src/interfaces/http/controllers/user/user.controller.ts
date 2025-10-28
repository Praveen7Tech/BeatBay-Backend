import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../../common/status.enum"
import { MESSAGES } from "../../../../common/constants.message"
import { editProfileUsecase } from "../../../../usecases/user/editProfile.useCase"

export class UserController{
    constructor(
        private readonly editProfileUserUsecase: editProfileUsecase
    ){}

    editProfile = async(req:Request, res:Response, next: NextFunction) =>{
        try {
            console.log("body ", req.body)
            const result = await this.editProfileUserUsecase.execute(req.body)
            return res.status(StatusCode.OK).json({message:MESSAGES.OTP_SEND})
        } catch (error) {
            next(error)
        }
    }
}