import { Request, Response } from 'express';
import { SignupUsecase } from '../../../usecases/auth/signup.useCase';
import { VerifyOtpUsecase } from '../../../usecases/auth/verify-otp.useCase';
import { StatusCode } from '../../../common/status.enum';
import logger from '../../../infrastructure/utils/logger/logger';

export class AuthController {
  constructor(
    // Remove the underscores
    private readonly signupUsecase: SignupUsecase,
    private readonly verifyOtpUsecase: VerifyOtpUsecase
  ) {}

  async signup(req: Request, res: Response): Promise<Response> {
    const {name, email, password } = req.body;
    logger.info(`Received signup request for: ${email}`);
    console.log("body--",req.body)

    if (!email || !password) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: 'Email and password are required' });
    }

    // Update the method call to use the new name
    const result = await this.signupUsecase.execute({ name, email, passwordHash: password }); 
    console.log("result-", result);

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
}
