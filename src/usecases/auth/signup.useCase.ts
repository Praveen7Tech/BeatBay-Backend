import { IUserRepository } from '../../domain/repositories/user.repository';
import { ICacheService } from '../../domain/services/cache.service';
import { User } from '../../domain/entities/user.entity';
import { MESSAGES } from '../../common/constants.message';
import { StatusCode } from '../../common/status.enum';
import logger from '../../infrastructure/utils/logger/logger';

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
    logger.info("reach usecase user")
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      return { status: StatusCode.CONFLICT, message: MESSAGES.USER_ALREADY_EXISTS };
    }

    const cacheKey = `otp:${request.email}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const otpExpirationInSeconds = 300;
    const name = request.name, email = request.email, password = request.passwordHash

    const cachedData = {name,email,password,otp, otpExpiredAt: Date.now() + 60 * 1000}

    await this.cacheService.set(cacheKey, JSON.stringify(cachedData), otpExpirationInSeconds);

    // setup mail service
    return {
      status: StatusCode.CREATED,
      message: MESSAGES.OTP_SEND,
      otp, 
    };
  }
}
