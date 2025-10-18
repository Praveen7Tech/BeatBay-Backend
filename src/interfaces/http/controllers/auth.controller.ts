import { Request, Response } from 'express';
import { SignupUsecase } from '../../../usecases/auth/signup.useCase';
import { VerifyOtpUsecase } from '../../../usecases/auth/verify-otp.useCase';
import { StatusCode } from '../../../common/status.enum';
import logger from '../../../infrastructure/utils/logger/logger';
import { ResendOtpUseCase } from '../../../usecases/auth/resend-otp.useCase';
import { LoginUsecase } from '../../../usecases/auth/login.useCase';
import { MESSAGES } from '../../../common/constants.message';
import { AuthStatusUsecase } from '../../../usecases/auth/authStatus.useCase';

export class AuthController {
  constructor(
    private readonly signupUsecase: SignupUsecase,
    private readonly verifyOtpUsecase: VerifyOtpUsecase,
    private readonly resendOtpUsecase: ResendOtpUseCase,
    private readonly loginUsecase: LoginUsecase,
    private readonly authStatusUsecase: AuthStatusUsecase
  ) {}

  async signup(req: Request, res: Response): Promise<Response> {
    const {name, email, password } = req.body;
    logger.info(`Received signup request for: ${email}`);

    if (!email || !password) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: 'Email and password are required' });
    }

    const result = await this.signupUsecase.execute({ name, email, password }); 

    if (result.status === StatusCode.CREATED) {
      return res.status(result.status).json({ message: result.message, otp: result.otp });
    }

    return res.status(result.status).json({ message: result.message });
  }

  async verifyOtp(req: Request, res: Response): Promise<Response> {
    const { email, otp } = req.body;
    logger.info(`Received OTP verification request for: ${email}`);
    if (!email || !otp) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: 'Email and OTP are required' });
    }
    const result = await this.verifyOtpUsecase.execute({ email, otp });
    return res.status(result.status).json({ message: result.message });
  }

  async resendOtp(req: Request, res: Response) : Promise<Response> {
    const {email} = req.body

    const result = await this.resendOtpUsecase.execute({email})
    if(result.status === StatusCode.OK) {
      return res.status(result.status).json({message: result.message})
    }

    return res.status(result.status).json({message: result.message})
  }

  async login(req: Request, res: Response) : Promise<Response> {
    const {email, password} = req.body
    if(!email || !password){
      return res.status(StatusCode.BAD_REQUEST).json({message: "Email and password are required"})
    }

    const result = await this.loginUsecase.execute({email, password})
    if(result.status !== 200){
      return res.status(result.status).json({message:result.message})
    }

    // send access and refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure:false,
      maxAge: 7*24*60*60*1000
    });

    return res.status(result.status).json({message: result.message, accessToken:result.accessToken})
  }

  async authStatus(req:Request, res: Response) : Promise<Response> {
    const refreshToken = req.cookies?.refreshToken;

    if(!refreshToken){
      return res.status(StatusCode.UNAUTHORIZED).json({message: "REFRESHTOKEN IS MISSING"})
    }

    const result = await this.authStatusUsecase.execute(refreshToken)
    return res.status(StatusCode.OK).json({
      user:result.user, accessToken: result.accessToken
    })
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(StatusCode.UNAUTHORIZED).json({ message: "Refresh token missing" });
    }

    const result = await this.authStatusUsecase.execute(refreshToken);

    // Rotation
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, 
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCode.OK).json({
      accessToken: result.accessToken
    });
  }

 async logout(req: Request, res: Response): Promise<Response> {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: '/',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
}

}
