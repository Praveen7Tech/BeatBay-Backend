import { NextFunction, Request, Response } from "express";
import { GoogleLoginRequestDTO,  LoginRequestDTO, ResendOtpRequestDTO, ResetPasswordDTO, SignupRequestDTO,   VerifyEmailRequestDTO,   VerifyOtpRequestDTO } from "../../../../application/dto/auth/request.dto";
import { StatusCode } from "../../../../common/constants/status.enum";
import { MESSAGES } from "../../../../common/constants/constants.message";
import { COOKIE_OPTIONS } from "../../../../common/cookie/cookieOptions";
import { GoogleLoginRequestSchema, LoginRequestSchema, ResendOtpRequestSchema, ResetPassRequestSchema, SignupRequestSchema, VerifyEmailRequestSchema, VerifyOtpRequestSchema } from "../../validators/auth/auth.validator";
import { IArtistSignupUsecase } from "../../../../application/interfaces/usecase/artist/artist-signup-usecase.interface";
import { IArtistVerifyOTPuseCase } from "../../../../application/interfaces/usecase/artist/artist-verify-otp-usecase.interface";
import { IArtistResendOtpUseCase } from "../../../../application/interfaces/usecase/artist/artist-resend-otp-usecase.interface";
import { IArtistLoginUsecase } from "../../../../application/interfaces/usecase/artist/artist-loin-usecase.interface";
import { IArtistGoogleLoginUseCase } from "../../../../application/interfaces/usecase/artist/artist-google-login-usecase.interface";
import { IArtistVerifyEmailUsecase } from "../../../../application/interfaces/usecase/artist/artist-verify-email-usecase.interface";
import { IArtistResetPasswordUsecase } from "../../../../application/interfaces/usecase/artist/artist-reset-password-usecase.interface";


export class artistAuthController {
    constructor(
        private readonly _artistSignupUsecase: IArtistSignupUsecase,
        private readonly _artistVerifyOTPusecase: IArtistVerifyOTPuseCase,
        private readonly _artistResendOtpUsecase: IArtistResendOtpUseCase,
        private readonly _artistLoginUsecase: IArtistLoginUsecase,
        private readonly _artistGoogleLoginUsecase: IArtistGoogleLoginUseCase,
        private readonly _artistVerifyEmailUsecase: IArtistVerifyEmailUsecase,
        private readonly _artistResetPasswordUsecase: IArtistResetPasswordUsecase,
    ){}

    signUp = async(req:Request, res:Response, next: NextFunction) =>{
        try {
            const dto: SignupRequestDTO = SignupRequestSchema.parse(req.body)
            await this._artistSignupUsecase.execute(dto)

            return res.status(StatusCode.OK).json({message:MESSAGES.OTP_SEND})
        } catch (error) {
            next(error)
        }
    }

    verifyOtp = async(req:Request, res:Response, next: NextFunction) =>{
        try {
            const dto: VerifyOtpRequestDTO = VerifyOtpRequestSchema.parse(req.body)
    
            await this._artistVerifyOTPusecase.execute(dto);
            return res.status(StatusCode.OK).json(MESSAGES.OTP_VERIFIED);
        } catch (error) {
            next(error);
       }
    }   

    resendOTP = async(req:Request, res:Response, next:NextFunction)=>{
        try {
            const dto: ResendOtpRequestDTO= ResendOtpRequestSchema.parse(req.body)
            await this._artistResendOtpUsecase.execute(dto)
          
            return res.status(StatusCode.OK).json(MESSAGES.OTP_RESEND_SUCCESS)
        } catch (error) {
            next(error)
        }
    }

    login = async(req:Request, res:Response, next: NextFunction)=>{
        try {
            const dto: LoginRequestDTO= LoginRequestSchema.parse(req.body)

            const result = await this._artistLoginUsecase.execute(dto)

            // send access and refresh token
            res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

            return res.status(StatusCode.OK).json({message: MESSAGES.VERIFICATION_COMPLETE, accessToken:result.accessToken, user: result.user})            
        } catch (error) {
            next(error)
        }
    }

    logOut = async(req: Request, res: Response, next:NextFunction) =>{
      try {
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        return res.status(StatusCode.OK).json({message:MESSAGES.LOGIN_SUCCESSFULL});
      } catch (error) {
        next(error)
      }
   }
   
    googleSignup = async(req:Request, res:Response, next: NextFunction)=>{
        try {
        const dto : GoogleLoginRequestDTO = GoogleLoginRequestSchema.parse(req.body)
        const response = await this._artistGoogleLoginUsecase.execute(dto)
        
        res.cookie("refreshToken", response.refreshToken, COOKIE_OPTIONS)
        return res.status(StatusCode.CREATED).json({ message:MESSAGES.GOOGLE_LOGIN,accessToken:response.accessToken, user: response.user})
    } catch (error) {
        next(error)
    }
  }  
  
    verifyEmail = async(req: Request, res:Response, next: NextFunction)=>{
        try {
             const dto : VerifyEmailRequestDTO = VerifyEmailRequestSchema.parse(req.body)
            await this._artistVerifyEmailUsecase.execute(dto)
            return res.status(StatusCode.CREATED).json({message:MESSAGES.PASSWORD_RESET_LINK})            
        } catch (error) {
            next(error)
        }
    }
  
    resetPassword= async(req:Request, res:Response, next: NextFunction)=>{
          
        try {
            const {password, token} = req.body
    
            const dto : ResetPasswordDTO = ResetPassRequestSchema.parse({token,password})
    
            await this._artistResetPasswordUsecase.execute(dto)
            
            return res.status(StatusCode.OK).json({message:MESSAGES.REST_PASSWORD_SUCCESS})
        } catch (error) {
          next(error)
        }
    }

}