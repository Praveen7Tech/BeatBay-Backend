import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../../../../common/constants/status.enum';
import { MESSAGES } from '../../../../common/constants/constants.message';
import { COOKIE_OPTIONS } from '../../../../common/cookie/cookieOptions';
import { SignupRequestDTO,VerifyOtpRequestDTO,ResendOtpRequestDTO, LoginRequestDTO,VerifyEmailRequestDTO,
  ResetPasswordDTO, GoogleLoginRequestDTO} from "../../../../application/dto/auth/request.dto";
import { SignupRequestSchema,VerifyOtpRequestSchema,ResendOtpRequestSchema, LoginRequestSchema,VerifyEmailRequestSchema, ResetPassRequestSchema, GoogleLoginRequestSchema} from "../../validators/auth/auth.validator";
import { ISignupUsecase } from '../../../../application/interfaces/usecase/user-auth/signup-usecase.interface';
import { IVerifyOtpUsecase } from '../../../../application/interfaces/usecase/user-auth/verify-otp-usecase.interface';
import { IResendOtpUseCase } from '../../../../application/interfaces/usecase/user-auth/resend-otp.-usecase.interface';
import { ILoginUsecase } from '../../../../application/interfaces/usecase/user-auth/login-usecase.interface';
import { IAuthStatusUsecase } from '../../../../application/interfaces/usecase/user-auth/auth-status-usecase.interface';
import { IVerifyEmailUsecase } from '../../../../application/interfaces/usecase/user-auth/verify-email-usecase.interface';
import { IResetPasswordUsecase } from '../../../../application/interfaces/usecase/user-auth/reset-password-usecase.terface';
import { IGoogleLoginUsecase } from '../../../../application/interfaces/usecase/user-auth/goggle-login-usecase.interface';
import logger from '../../../../infrastructure/utils/logger/logger';


export class AuthController {
  constructor(
    private readonly _signupUsecase: ISignupUsecase,
    private readonly _verifyOtpUsecase: IVerifyOtpUsecase,
    private readonly _resendOtpUsecase: IResendOtpUseCase,
    private readonly _loginUsecase: ILoginUsecase,
    private readonly _authStatusUsecase: IAuthStatusUsecase,
    private readonly _verifyEmailUsecase: IVerifyEmailUsecase,
    private readonly _resetPasswordUsecase: IResetPasswordUsecase,
    private readonly _googleLoginUsecase: IGoogleLoginUsecase
  ) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: SignupRequestDTO= SignupRequestSchema.parse(req.body)

       await this._signupUsecase.execute(dto);
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
       await this._resendOtpUsecase.execute(dto)
      
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
          logger.info(`refresh token :  ${refreshToken}`)          
          if (!refreshToken) {
              return res.status(StatusCode.OK).json({ user: null, accessToken: null });
          }
logger.info("auth status check")
          const result = await this._authStatusUsecase.execute({ refreshToken });

          res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
 logger.info("new token")         
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
