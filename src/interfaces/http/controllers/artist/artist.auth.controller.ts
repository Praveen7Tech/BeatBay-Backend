import { NextFunction, Request, Response } from "express";
import { GoogleLoginRequestDTO,  LoginRequestDTO, ResendOtpRequestDTO, SignupRequestDTO,   VerifyOtpRequestDTO } from "../../../../usecases/dto/auth/request.dto";
import { ArtistSignupUsecase } from "../../../../usecases/artist/artistSignup.useCase"; 
import { StatusCode } from "../../../../common/status.enum";
import { MESSAGES } from "../../../../common/constants.message";
import { ArtistVerifyOTPuseCase } from "../../../../usecases/artist/artistVerifyOTP.useCase";
import { ArtistResendOtpUseCase } from "../../../../usecases/artist/artistResendOTP.useCase";
import { COOKIE_OPTIONS } from "../../../../common/cookie/cookieOptions";
import { ArtistLoginUsecase } from "../../../../usecases/artist/artistLogin.useCase";
import { ArtistGoogleLoginUseCase } from "../../../../usecases/artist/artistGoogleSignup.useCase";
import { GoogleLoginRequestSchema, LoginRequestSchema, ResendOtpRequestSchema, SignupRequestSchema, VerifyOtpRequestSchema } from "../../validators/auth/auth.validator";


export class artistAuthController {
    constructor(
        private readonly artistSignupUsecase:ArtistSignupUsecase,
        private readonly artistVerifyOTPusecase:ArtistVerifyOTPuseCase,
        private readonly artistResendOtpUsecase: ArtistResendOtpUseCase,
        private readonly artistLoginUsecase:ArtistLoginUsecase,
        private readonly artistGoogleLoginUsecase: ArtistGoogleLoginUseCase
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
            return res.status(200).json({ message: 'OTP verified and artist created suucessfully..' });
        } catch (error) {
            next(error);
       }
    }   

    resendOTP = async(req:Request, res:Response, next:NextFunction)=>{
        try {
            const dto: ResendOtpRequestDTO= ResendOtpRequestSchema.parse(req.body)
            await this.artistResendOtpUsecase.execute(dto)
          
            return res.status(StatusCode.OK).json({message: "Otp Resend suucessfully"})
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

            return res.status(StatusCode.OK).json({message: "user verification complete.", accessToken:result.accessToken, user: result.user})            
        } catch (error) {
            next(error)
        }
    }

    logOut = async(req: Request, res: Response, next:NextFunction) =>{
      try {
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        return res.status(200).json({ message: 'Artist Logged out successfully' });
      } catch (error) {
        next(error)
      }
   }
   
    googleSignup = async(req:Request, res:Response, next: NextFunction)=>{
        console.log("artist 1 ")
        try {
        const dto : GoogleLoginRequestDTO = GoogleLoginRequestSchema.parse(req.body)
        const response = await this.artistGoogleLoginUsecase.execute(dto)
        
        res.cookie("refreshToken", response.refreshToken, COOKIE_OPTIONS)
        return res.status(StatusCode.CREATED).json({ message:"google login successfull",accessToken:response.accessToken, user: response.user})
    } catch (error) {
        next(error)
    }
  }   

}