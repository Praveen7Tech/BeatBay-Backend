import { IUserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { MESSAGES } from '../../common/constants.message';
import { StatusCode } from '../../common/status.enum';
import { ICatcheService } from '../../domain/services/cache.service';

interface SignupRequest {
  email: string;
  passwordHash: string;
}

export class SignupUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheService: ICatcheService
  ) {}

  async execute(request: SignupRequest): Promise<{ user?: User; status: StatusCode; message: string; otp?: string }> {
    // 1. Check for existing user in MongoDB 
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      return { status: StatusCode.CONFLICT, message: MESSAGES.USER_ALREADY_EXISTS };
    }

    // 2. Check for an existing OTP in Redis
    const cacheKey = `otp:${request.email}`;
    const existingOtp = await this.cacheService.get(cacheKey);

    if (existingOtp) {
      // An OTP was already sent recently
      return { status: StatusCode.OK, message: MESSAGES.OTP_SEND};
    }

    // 3. Generate and store a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpirationInSeconds = 300; // 5 minutes

    await this.cacheService.set(cacheKey, otp, otpExpirationInSeconds);

    // In a real application, you would now send the OTP via email or SMS
    return {
      status: StatusCode.OK,
      message: MESSAGES.OTP_SEND,
      otp: otp,
    };
  }
}
