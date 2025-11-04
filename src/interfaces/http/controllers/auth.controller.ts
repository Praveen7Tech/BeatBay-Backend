import { Request, Response, NextFunction } from 'express';
import { SignupUsecase } from '../../../usecases/auth/signup.useCase';
import { VerifyOtpUsecase } from '../../../usecases/auth/verify-otp.useCase';
import { StatusCode } from '../../../common/status.enum';
import logger from '../../../infrastructure/utils/logger/logger';
import { ResendOtpUseCase } from '../../../usecases/auth/resend-otp.useCase';
import { LoginUsecase } from '../../../usecases/auth/login.useCase';
import { MESSAGES } from '../../../common/constants.message';
import { AuthStatusUsecase } from '../../../usecases/auth/authStatus.useCase';
import { COOKIE_OPTIONS } from '../../../common/cookie/cookieOptions';
import { VerifyEmailUsecase } from '../../../usecases/auth/verify-email.useCase';
import { ResetPasswordUsecase } from '../../../usecases/auth/reset-password.useCase';
import { GoogleLoginUsecase } from '../../../usecases/auth/googleLogin.useCase';

import { OAuth2Client } from 'google-auth-library'
const client_id = process.env.GOOGLE_CLIENT_ID!;
const client = new OAuth2Client(client_id);

import {
  SignupRequestDTO,
  VerifyOtpRequestDTO,
  ResendOtpRequestDTO,
  LoginRequestDTO,
  AuthStatusRequestDTO,
  VerifyEmailRequestDTO,
  ResetPasswordDTO,
  GoogleLoginRequestDTO
} from "../../../usecases/dto/auth/request.dto";

import {
  SignupRequestSchema,
  VerifyOtpRequestSchema,
  ResendOtpRequestSchema,
  LoginRequestSchema,
  AuthStatusRequestSchema,
  VerifyEmailRequestSchema,
  ResetPassRequestSchema,
  GoogleLoginRequestSchema
} from "../validators/auth/auth.validator";


export class AuthController {
  constructor(
    private readonly signupUsecase: SignupUsecase,
    private readonly verifyOtpUsecase: VerifyOtpUsecase,
    private readonly resendOtpUsecase: ResendOtpUseCase,
    private readonly loginUsecase: LoginUsecase,
    private readonly authStatusUsecase: AuthStatusUsecase,
    private readonly verifyEmailUsecase: VerifyEmailUsecase,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
    private readonly googleLoginUsecase: GoogleLoginUsecase
  ) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: SignupRequestDTO= SignupRequestSchema.parse(req.body)

      const result = await this.signupUsecase.execute(dto);
      return res.status(201).json({ message: 'OTP sent', otp: result.otp });
    } catch (error) {
      next(error); 
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: VerifyOtpRequestDTO = VerifyOtpRequestSchema.parse(req.body)
      //if (!req.body.email || !req.body.otp) throw new Error('Email and OTP required');

      await this.verifyOtpUsecase.execute(dto);
      return res.status(200).json({ message: 'OTP verified and user created' });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: ResendOtpRequestDTO= ResendOtpRequestSchema.parse(req.body)
      const result = await this.resendOtpUsecase.execute(dto)
      
      return res.status(StatusCode.OK).json({message: "Otp Resend suucessfully"})
    } catch (error) {
      next(error)
    }
    
  }

  async login(req: Request, res: Response, next: NextFunction){
    try {
      const dto: LoginRequestDTO= LoginRequestSchema.parse(req.body)

      const result = await this.loginUsecase.execute(dto)

      // send access and refresh token
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

      return res.status(StatusCode.OK).json({message: "user verification complete.", accessToken:result.accessToken, user: result.user})
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

          const result = await this.authStatusUsecase.execute({ refreshToken });

          res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
          return res.status(StatusCode.OK).json({
              user: result.user,
              accessToken: result.accessToken
          });
      } catch (error) {
          res.clearCookie("refreshToken", COOKIE_OPTIONS);
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

  async verifyEmail(req:Request, res: Response, next: NextFunction) {
    try {
      const dto : VerifyEmailRequestDTO = VerifyEmailRequestSchema.parse(req.body)
      await this.verifyEmailUsecase.execute(dto)
      return res.status(StatusCode.CREATED).json({message: "password reset link send to email suucessfully."})
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req:Request, res:Response, next: NextFunction){
    try {
      const {password, token} = req.body

      const dto : ResetPasswordDTO = ResetPassRequestSchema.parse({token,password})

      await this.resetPasswordUsecase.execute(dto)
      return res.status(StatusCode.OK).json({message: "new password updated successfully"})
    } catch (error) {
      next(error)
    }
  }

  async googleSignup(req:Request, res:Response, next: NextFunction){
    try {
       const dto : GoogleLoginRequestDTO = GoogleLoginRequestSchema.parse(req.body)
       const response = await this.googleLoginUsecase.execute(dto)
    
       res.cookie("refreshToken", response.refreshToken, COOKIE_OPTIONS)
       return res.status(StatusCode.CREATED).json({ message:"google login successfull",accessToken:response.accessToken, user: response.user})
    } catch (error) {
      next(error)
    }
  }

}
