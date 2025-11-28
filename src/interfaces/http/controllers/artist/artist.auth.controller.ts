import { NextFunction, Request, Response } from "express";
import { GoogleLoginRequestDTO,  LoginRequestDTO, ResendOtpRequestDTO, ResetPasswordDTO, SignupRequestDTO,   VerifyEmailRequestDTO,   VerifyOtpRequestDTO } from "../../../../usecases/dto/auth/request.dto";
import { ArtistSignupUsecase } from "../../../../usecases/artist/auth/artistSignup.useCase"; 
import { StatusCode } from "../../../../common/constants/status.enum";
import { MESSAGES } from "../../../../common/constants/constants.message";
import { ArtistVerifyOTPuseCase } from "../../../../usecases/artist/auth/artistVerifyOTP.useCase";
import { ArtistResendOtpUseCase } from "../../../../usecases/artist/auth/artistResendOTP.useCase";
import { COOKIE_OPTIONS } from "../../../../common/cookie/cookieOptions";
import { ArtistLoginUsecase } from "../../../../usecases/artist/auth/artistLogin.useCase";
import { ArtistGoogleLoginUseCase } from "../../../../usecases/artist/auth/artistGoogleSignup.useCase";
import { GoogleLoginRequestSchema, LoginRequestSchema, ResendOtpRequestSchema, ResetPassRequestSchema, SignupRequestSchema, VerifyEmailRequestSchema, VerifyOtpRequestSchema } from "../../validators/auth/auth.validator";
import { ArtistVerifyEmailUsecase } from "../../../../usecases/artist/auth/artistVerifyEmail.useCase";
import { ArtistResetPasswordUsecase } from "../../../../usecases/artist/auth/artistResetPassword.useCase"; 


export class artistAuthController {
    constructor(
        private readonly artistSignupUsecase:ArtistSignupUsecase,
        private readonly artistVerifyOTPusecase:ArtistVerifyOTPuseCase,
        private readonly artistResendOtpUsecase: ArtistResendOtpUseCase,
        private readonly artistLoginUsecase:ArtistLoginUsecase,
        private readonly artistGoogleLoginUsecase: ArtistGoogleLoginUseCase,
        private readonly artistVerifyEmailUsecase: ArtistVerifyEmailUsecase,
        private readonly artistResetPasswordUsecase: ArtistResetPasswordUsecase,
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

    verifyOtp = async(req:Request, res:Response, next: NextFunction) =>{
        try {
            const dto: VerifyOtpRequestDTO = VerifyOtpRequestSchema.parse(req.body)
    
            await this.artistVerifyOTPusecase.execute(dto);
            return res.status(200).json(MESSAGES.OTP_VERIFIED);
        } catch (error) {
            next(error);
       }
    }   

    resendOTP = async(req:Request, res:Response, next:NextFunction)=>{
        try {
            const dto: ResendOtpRequestDTO= ResendOtpRequestSchema.parse(req.body)
            await this.artistResendOtpUsecase.execute(dto)
          
            return res.status(StatusCode.OK).json(MESSAGES.OTP_RESEND_SUCCESS)
        } catch (error) {
            next(error)
        }
    }

    login = async(req:Request, res:Response, next: NextFunction)=>{
        try {
            const dto: LoginRequestDTO= LoginRequestSchema.parse(req.body)

            const result = await this.artistLoginUsecase.execute(dto)

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
        return res.status(200).json({message:MESSAGES.LOGIN_SUCCESSFULL});
      } catch (error) {
        next(error)
      }
   }
   
    googleSignup = async(req:Request, res:Response, next: NextFunction)=>{
        try {
        const dto : GoogleLoginRequestDTO = GoogleLoginRequestSchema.parse(req.body)
        const response = await this.artistGoogleLoginUsecase.execute(dto)
        
        res.cookie("refreshToken", response.refreshToken, COOKIE_OPTIONS)
        return res.status(StatusCode.CREATED).json({ message:MESSAGES.GOOGLE_LOGIN,accessToken:response.accessToken, user: response.user})
    } catch (error) {
        next(error)
    }
  }  
  
    verifyEmail = async(req: Request, res:Response, next: NextFunction)=>{
        try {
             const dto : VerifyEmailRequestDTO = VerifyEmailRequestSchema.parse(req.body)
            await this.artistVerifyEmailUsecase.execute(dto)
            return res.status(StatusCode.CREATED).json({message:MESSAGES.PASSWORD_RESET_LINK})            
        } catch (error) {
            next(error)
        }
    }
  
    resetPassword= async(req:Request, res:Response, next: NextFunction)=>{
          
        try {
            const {password, token} = req.body
    
            const dto : ResetPasswordDTO = ResetPassRequestSchema.parse({token,password})
    
            await this.artistResetPasswordUsecase.execute(dto)
            
            return res.status(StatusCode.OK).json({message:MESSAGES.REST_PASSWORD_SUCCESS})
        } catch (error) {
          next(error)
        }
    }

}