import { ICacheService } from '../../domain/services/cache.service';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { MESSAGES } from '../../common/constants.message';
import { StatusCode } from '../../common/status.enum';

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export class VerifyOtpUsecase {
  constructor(
    private readonly cacheService: ICacheService,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: VerifyOtpRequest): Promise<{ status: StatusCode; message: string }> {
    const cacheKey = `otp:${request.email}`;
    const storedOtp = await this.cacheService.get(cacheKey);
    console.log("req otp - ",request.otp, storedOtp)

    if(storedOtp)

    if (storedOtp !== request.otp) {
      return { status: StatusCode.BAD_REQUEST, message: 'Invalid OTP' };
    }

    // 
    await this.userRepository.create({ email: request.email, passwordHash: 'temporary_hash_until_login' });

    // Clean up the OTP from cache
    await this.cacheService.delete(cacheKey);

    return { status: StatusCode.OK, message: 'OTP verified and user created successfully.' };
  }
}
