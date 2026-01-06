import { NextFunction, Request, Response } from "express";
import { AdminLoginUsecase } from "../../../../usecases/admin/auth/adminLogin.useCase";
import { LoginRequestDTO } from "../../../../application/dto/auth/request.dto";
import { COOKIE_OPTIONS } from "../../../../common/cookie/cookieOptions";
import { StatusCode } from "../../../../common/constants/status.enum";
import { LoginRequestSchema } from "../../validators/auth/auth.validator";
import { MESSAGES } from "../../../../common/constants/constants.message";


export class AdminAuthController {
    constructor(
        private readonly _adminLoginUsecase: AdminLoginUsecase
    ){}

    async login(req: Request, res:Response, next: NextFunction) {
        try {
            const dto : LoginRequestDTO = LoginRequestSchema.parse(req.body)
            const data = await this._adminLoginUsecase.execute(dto)

            res.cookie("refreshToken", data.refreshToken, COOKIE_OPTIONS)

            return res.status(StatusCode.OK).json({message: MESSAGES.VERIFICATION_COMPLETE, accessToken: data.accessToken, user: data.user})
        } catch (error) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next:NextFunction) {
      try {
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        return res.status(200).json(MESSAGES.LOGOUT_SUCCESSFUL);
      } catch (error) {
        next(error)
      }
   }
}