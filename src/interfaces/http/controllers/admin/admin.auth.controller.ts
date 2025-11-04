import { NextFunction, Request, Response } from "express";
import { AdminLoginUsecase } from "../../../../usecases/admin/adminLogin.useCase";
import { LoginRequestDTO } from "../../../../usecases/dto/auth/request.dto";
import { COOKIE_OPTIONS } from "../../../../common/cookie/cookieOptions";
import { StatusCode } from "../../../../common/status.enum";
import { LoginRequestSchema } from "../../validators/auth/auth.validator";


export class AdminAuthController {
    constructor(
        private readonly adminLoginUsecase: AdminLoginUsecase
    ){}

    async login(req: Request, res:Response, next: NextFunction) {
        try {
            const dto : LoginRequestDTO = LoginRequestSchema.parse(req.body)
            const data = await this.adminLoginUsecase.execute(dto)

            res.cookie("refreshToken", data.refreshToken, COOKIE_OPTIONS)

            return res.status(StatusCode.OK).json({message: "admin verification complete.", accessToken: data.accessToken, user: data.user})
        } catch (error) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next:NextFunction) {
      try {
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        return res.status(200).json({ message: 'Logged out successfully' });
      } catch (error) {
        next(error)
      }
   }
}