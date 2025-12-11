import { IUserRepository } from '../../../domain/repositories/user.repository';
import { ICacheService } from '../../../domain/services/cache.service';
import { IOtpService } from '../../../domain/services/otp.service';
import { IEmailService } from '../../../domain/services/mail.service';
import { EmailFormat } from '../../../infrastructure/services/email/email-format';
import { SignupRequestDTO } from '../../dto/auth/request.dto';
import { SignupResponseDTO } from '../../dto/auth/response.dto';
import { AlreadyExistError } from '../../../common/errors/common/common.errors';
import logger from '../../../infrastructure/utils/logger/logger';



export class SignupUsecase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _cacheService: ICacheService,
    private readonly _otpService: IOtpService,
    private readonly _emailService: IEmailService
  ) {}

  async execute(request: SignupRequestDTO): Promise<SignupResponseDTO> {
    const existingUser = await this._userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new AlreadyExistError("User already exist in this email.!");
    }

    const otp = await this._otpService.generate();
    const cacheKey = `otp:${request.email}`;
    const otpExpirationInSeconds = 300;
    const cachedData = { ...request, otp, otpExpiredAt: Date.now() + 2 * 60 * 1000 };

    await this._cacheService.set(cacheKey, cachedData, otpExpirationInSeconds);

    const otpMail = EmailFormat.otp(otp);
    await this._emailService.sendMail(request.email, otpMail.subject, otpMail.text, otpMail.html);
    
    logger.info(`user OTP: ${otp}`)
    return { otp };
  }
}
