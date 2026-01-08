import { Request, Response, NextFunction } from 'express';
import { SignupUsecase } from '../../../../usecases/user/auth/signup.useCase';
import { VerifyOtpUsecase } from '../../../../usecases/user/auth/verify-otp.useCase';
import { StatusCode } from '../../../../common/constants/status.enum';
import logger from '../../../../infrastructure/utils/logger/DevLogger';
import { ResendOtpUseCase } from '../../../../usecases/user/auth/resend-otp.useCase';
import { LoginUsecase } from '../../../../usecases/user/auth/login.useCase';
import { MESSAGES } from '../../../../common/constants/constants.message';
import { AuthStatusUsecase } from '../../../../usecases/user/auth/authStatus.useCase';
import { COOKIE_OPTIONS } from '../../../../common/cookie/cookieOptions';
import { VerifyEmailUsecase } from '../../../../usecases/user/auth/verify-email.useCase';
import { ResetPasswordUsecase } from '../../../../usecases/user/auth/reset-password.useCase';
import { GoogleLoginUsecase } from '../../../../usecases/user/auth/googleLogin.useCase';


import {
  SignupRequestDTO,
  VerifyOtpRequestDTO,
  ResendOtpRequestDTO,
  LoginRequestDTO,
  VerifyEmailRequestDTO,
  ResetPasswordDTO,
  GoogleLoginRequestDTO
} from "../../../../application/dto/auth/request.dto";

import {
  SignupRequestSchema,
  VerifyOtpRequestSchema,
  ResendOtpRequestSchema,
  LoginRequestSchema,
  VerifyEmailRequestSchema,
  ResetPassRequestSchema,
  GoogleLoginRequestSchema
} from "../../validators/auth/auth.validator";


export class AuthController {
  constructor(
    private readonly _signupUsecase: SignupUsecase,
    private readonly _verifyOtpUsecase: VerifyOtpUsecase,
    private readonly _resendOtpUsecase: ResendOtpUseCase,
    private readonly _loginUsecase: LoginUsecase,
    private readonly _authStatusUsecase: AuthStatusUsecase,
    private readonly _verifyEmailUsecase: VerifyEmailUsecase,
    private readonly _resetPasswordUsecase: ResetPasswordUsecase,
    private readonly _googleLoginUsecase: GoogleLoginUsecase
  ) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: SignupRequestDTO= SignupRequestSchema.parse(req.body)

      const result = await this._signupUsecase.execute(dto);
      return res.status(StatusCode.CREATED).json({message:MESSAGES.OTP_SEND});
    } catch (error) {
      next(error); 
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: VerifyOtpRequestDTO = VerifyOtpRequestSchema.parse(req.body)

      await this._verifyOtpUsecase.execute(dto);
      return res.status(StatusCode.OK).json({message:MESSAGES.OTP_VERIFIED});
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: ResendOtpRequestDTO= ResendOtpRequestSchema.parse(req.body)
      const result = await this._resendOtpUsecase.execute(dto)
      
      return res.status(StatusCode.OK).json({message:MESSAGES.OTP_RESEND_SUCCESS})
    } catch (error) {
      next(error)
    }
    
  }

  async login(req: Request, res: Response, next: NextFunction){
    try {
      const dto: LoginRequestDTO= LoginRequestSchema.parse(req.body)

      const result = await this._loginUsecase.execute(dto)

      // send access and refresh token
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

      return res.status(StatusCode.OK).json({message: MESSAGES.VERIFICATION_COMPLETE, accessToken:result.accessToken, user: result.user})
    } catch (error) {
      next(error)
    }
    
  }

  async authStatus(req: Request, res: Response, next: NextFunction) {
     try {
          const refreshToken = req.cookies?.refreshToken;
          if (!refreshToken) {
              return res.status(StatusCode.OK).json({ user: null, accessToken: null });
          }

          const result = await this._authStatusUsecase.execute({ refreshToken });

          res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
          return res.status(StatusCode.OK).json({
              user: result.user,
              accessToken: result.accessToken,  
          });
      } catch (error) {
          res.clearCookie("refreshToken", COOKIE_OPTIONS);
          next(error)
      }
  }

  async logout(req: Request, res: Response, next:NextFunction) {
      try {
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
      return res.status(StatusCode.OK).json({message:MESSAGES.LOGOUT_SUCCESSFUL});
      } catch (error) {
        next(error)
      }
  }

  async verifyEmail(req:Request, res: Response, next: NextFunction) {
    try {
      const dto : VerifyEmailRequestDTO = VerifyEmailRequestSchema.parse(req.body)
      await this._verifyEmailUsecase.execute(dto)
      return res.status(StatusCode.CREATED).json({message:MESSAGES.PASSWORD_RESET_LINK})
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req:Request, res:Response, next: NextFunction){
    try {
      const {password, token} = req.body

      const dto : ResetPasswordDTO = ResetPassRequestSchema.parse({token,password})

      await this._resetPasswordUsecase.execute(dto)
      return res.status(StatusCode.OK).json({message:MESSAGES.REST_PASSWORD_SUCCESS})
    } catch (error) {
      next(error)
    }
  }

  async googleSignup(req:Request, res:Response, next: NextFunction){
    try {
       const dto : GoogleLoginRequestDTO = GoogleLoginRequestSchema.parse(req.body)
       const response = await this._googleLoginUsecase.execute(dto)
    
       res.cookie("refreshToken", response.refreshToken, COOKIE_OPTIONS)
       return res.status(StatusCode.CREATED).json({ message:MESSAGES.GOOGLE_LOGIN,accessToken:response.accessToken, user: response.user})
    } catch (error) {
      next(error)
    }
  }

}
