import { IUserRepository } from '../../domain/repositories/user.repository';
import { ICacheService } from '../../domain/services/cache.service';
import { User } from '../../domain/entities/user.entity';
import { MESSAGES } from '../../common/constants.message';
import { StatusCode } from '../../common/status.enum';

interface SignupRequest {
  name: string,
  email: string;
  passwordHash: string;
}

export class SignupUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheService: ICacheService
  ) {}

  async execute(request: SignupRequest): Promise<{ user?: User; status: StatusCode; message: string; otp?: string }> {
    console.log("reach usecase")
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      return { status: StatusCode.CONFLICT, message: MESSAGES.USER_ALREADY_EXISTS };
    }

    const cacheKey = `otp:${request.email}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpirationInSeconds = 300;
    const name = request.name, email = request.email, password = request.passwordHash

    const cachedData = {name,email,password,otp}

    await this.cacheService.set(cacheKey, JSON.stringify(cachedData), otpExpirationInSeconds);

    // setup mail service
    return {
      status: StatusCode.CREATED,
      message: MESSAGES.OTP_SEND,
      otp, 
    };
  }
}
