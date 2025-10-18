import { IUserRepository } from '../../domain/repositories/user.repository';
import { ICacheService } from '../../domain/services/cache.service';
import { User } from '../../domain/entities/user.entity';
import { MESSAGES } from '../../common/constants.message';
import { StatusCode } from '../../common/status.enum';
import logger from '../../infrastructure/utils/logger/logger';
import { IOtpService } from '../../domain/services/otp.service';

interface SignupRequest {
  name: string,
  email: string;
  password: string;
}

export class SignupUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheService: ICacheService,
    private readonly otpService: IOtpService
  ) {}

  async execute(request: SignupRequest): Promise<{ user?: User; status: StatusCode; message: string; otp?: string }> {
    logger.info("reach usecase user")
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      return { status: StatusCode.CONFLICT, message: MESSAGES.USER_ALREADY_EXISTS };
    }

    const cacheKey = `otp:${request.email}`;
    const otp = await this.otpService.generate()
    console.log("otp ",otp)

    const otpExpirationInSeconds = 300;
    const name = request.name, email = request.email, password = request.password
//
    const cachedData = {name,email,password,otp, otpExpiredAt: Date.now() + 60 * 1000}

    await this.cacheService.set(cacheKey, cachedData, otpExpirationInSeconds);

    // setup mail service
    return {
      status: StatusCode.CREATED,
      message: MESSAGES.OTP_SEND,
      otp, 
    };
  }
}
