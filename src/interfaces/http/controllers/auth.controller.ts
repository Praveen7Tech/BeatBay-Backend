import { Request, Response } from 'express';
import { SignupUsecase } from '../../../usecases/auth/signup.useCase';
import { StatusCode } from '../../../common/status.enum';

export class AuthController {
  constructor(private readonly _signupUsecase: SignupUsecase) {}

  async signup(req: Request, res: Response): Promise<Response> {
    console.log("request reached signup")
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: 'Email and password are required' });
    }

    const result = await this._signupUsecase.execute({ email, passwordHash: password });

    if (result.user) {
      // Exclude sensitive information like passwordHash before sending the response
      const { passwordHash, ...userResponse } = result.user;
      return res.status(result.status).json({ message: result.message, user: userResponse });
    }

    return res.status(result.status).json({ message: result.message });
  }
}
