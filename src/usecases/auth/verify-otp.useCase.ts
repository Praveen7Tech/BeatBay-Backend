import { IUserRepository } from '../../domain/repositories/user.repository';
import { ICacheService } from '../../domain/services/cache.service';
import { OtpExpiredError, InvalidOtpError } from "../../common/errors/user.auth.error"

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export class VerifyOtpUsecase {
  constructor(
    private readonly cacheService: ICacheService,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: VerifyOtpRequest): Promise<void> {
    const cacheKey = `otp:${request.email}`;
    const cachedData = await this.cacheService.get(cacheKey);

    if (!cachedData) throw new OtpExpiredError();

    const { otp, otpExpiredAt } = cachedData;

    if (Date.now() > otpExpiredAt) throw new OtpExpiredError();
    if (otp !== request.otp) throw new InvalidOtpError();

    await this.userRepository.create(cachedData);
    await this.cacheService.delete(cacheKey);
  }
}
