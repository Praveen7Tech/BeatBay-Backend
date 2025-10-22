import { IUserRepository } from '../../domain/repositories/user.repository';
import { ICacheService } from '../../domain/services/cache.service';
import { OtpExpiredError, InvalidOtpError } from "../../common/errors/user.auth.error"
import { PasswordService } from '../../infrastructure/services/password/password-service';

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export class VerifyOtpUsecase {
  constructor(
    private readonly cacheService: ICacheService,
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(request: VerifyOtpRequest): Promise<void> {
    const cacheKey = `otp:${request.email}`;
    const cachedData = await this.cacheService.get(cacheKey);

    if (!cachedData) throw new OtpExpiredError();

    const {name, email, password, otp, otpExpiredAt } = cachedData;

    if (Date.now() > otpExpiredAt) throw new OtpExpiredError();
    if (otp !== request.otp) throw new InvalidOtpError();

    const passwordHash = await this.passwordService.hash(password)

    await this.userRepository.create({
      name, 
      email,
      password: passwordHash ,
      googleId:null, 
      profilePicture:null,
      role:"user",
    });
    await this.cacheService.delete(cacheKey);
  }
}
