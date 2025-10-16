import { Request, Response } from 'express';
import { SignupUsecase } from '../../../usecases/auth/signup.useCase';
import { VerifyOtpUsecase } from '../../../usecases/auth/verify-otp.useCase';
import { StatusCode } from '../../../common/status.enum';
import logger from '../../../infrastructure/utils/logger/logger';
import { ResendOtpUseCase } from '../../../usecases/auth/resend-otp.useCase';

export class AuthController {
  constructor(
    private readonly signupUsecase: SignupUsecase,
    private readonly verifyOtpUsecase: VerifyOtpUsecase,
    private readonly resendOtpUsecase: ResendOtpUseCase
  ) {}

  async signup(req: Request, res: Response): Promise<Response> {
    const {name, email, password } = req.body;
    logger.info(`Received signup request for: ${email}`);
    console.log("body--",req.body)

    if (!email || !password) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: 'Email and password are required' });
    }

    // Update the method call to use the new name
    const result = await this.signupUsecase.execute({ name, email, password }); 
    console.log("result-", result);

    if (result.status === StatusCode.CREATED) {
      return res.status(result.status).json({ message: result.message, otp: result.otp });
    }

    return res.status(result.status).json({ message: result.message });
  }

  async verifyOtp(req: Request, res: Response): Promise<Response> {
    const { email, otp } = req.body;
    console.log("e otp",email, otp)
    logger.info(`Received OTP verification request for: ${email}`);
    if (!email || !otp) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: 'Email and OTP are required' });
    }
    const result = await this.verifyOtpUsecase.execute({ email, otp });
    return res.status(result.status).json({ message: result.message });
  }

  async resendOtp(req: Request, res: Response) : Promise<Response> {
    console.log("resend otp-",req.body)
    const {email} = req.body

    const result = await this.resendOtpUsecase.execute({email})
    if(result.status === StatusCode.OK) {
      return res.status(result.status).json({message: result.message})
    }

    return res.status(result.status).json({message: result.message})
  }
}
