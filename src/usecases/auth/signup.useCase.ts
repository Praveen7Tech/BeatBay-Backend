import { IUserRepository } from '../../domain/repositories/user.repository';
import { ICacheService } from '../../domain/services/cache.service';
import { User } from '../../domain/entities/user.entity';
import { IOtpService } from '../../domain/services/otp.service';
import { IEmailService } from '../../domain/services/mail.service';
import { EmailFormat } from '../../infrastructure/services/email/email-format';
import { UserAlreadyExistsError } from '../../common/errors/user.auth.error'; 
import { SignupRequestDTO } from './dto/request.dto';
import { SignupResponseDTO } from './dto/response.dto';



export class SignupUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheService: ICacheService,
    private readonly otpService: IOtpService,
    private readonly emailService: IEmailService
  ) {}

  async execute(request: SignupRequestDTO): Promise<SignupResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const otp = await this.otpService.generate();
    const cacheKey = `otp:${request.email}`;
    const otpExpirationInSeconds = 300;
    const cachedData = { ...request, otp, otpExpiredAt: Date.now() + 2 * 60 * 1000 };

    await this.cacheService.set(cacheKey, cachedData, otpExpirationInSeconds);

    const otpMail = EmailFormat.otp(otp);
    await this.emailService.sendMail(request.email, otpMail.subject, otpMail.text, otpMail.html);
    
    console.log("otp ",otp)
    return { otp };
  }
}
