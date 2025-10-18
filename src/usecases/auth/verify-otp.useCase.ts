import { ICacheService } from '../../domain/services/cache.service';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { MESSAGES } from '../../common/constants.message';
import { StatusCode } from '../../common/status.enum';
import { CachedData } from '../../domain/services/cache.service';

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
    const cachedData = await this.cacheService.get(cacheKey);
    
    if(!cachedData){
      return {status: StatusCode.NOT_FOUND, message: "OTP expired or not found"}
    }

    const {otp, otpExpiredAt} = cachedData

    if (Date.now() > otpExpiredAt){
      return {status: StatusCode.NOT_FOUND, message: MESSAGES.OTP_EXPIRED}
    }

    if (otp !== request.otp) {
      return { status: StatusCode.BAD_REQUEST, message: MESSAGES.INVALID_OTP };
    }

    await this.userRepository.create(cachedData);

    // Clean up the OTP from cache
    await this.cacheService.delete(cacheKey);

    return { status: StatusCode.OK, message: 'OTP verified and user created successfully.' };
  }
}
