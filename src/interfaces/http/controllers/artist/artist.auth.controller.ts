import { NextFunction, Request, Response } from "express";
import { SignupRequestDTO,  SignupRequestSchema } from "../../../../usecases/auth/dto/request.dto";
import { artistSignupUsecase } from "../../../../usecases/artist/artistSignup.useCase";
import { StatusCode } from "../../../../common/status.enum";
import { MESSAGES } from "../../../../common/constants.message";


export class artistAuthController {
    constructor(
        private readonly artistSignupUsecase:artistSignupUsecase
    ){}

    signUp = async(req:Request, res:Response, next: NextFunction) =>{
        try {
            const dto: SignupRequestDTO = SignupRequestSchema.parse(req.body)
             await this.artistSignupUsecase.execute(dto)

            return res.status(StatusCode.OK).json({message:MESSAGES.OTP_SEND})
        } catch (error) {
            next(error)
        }
    }
}