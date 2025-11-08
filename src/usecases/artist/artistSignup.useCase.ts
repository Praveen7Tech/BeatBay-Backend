
import { AlreadyExistError } from "../../common/errors/common/common.errors";
import { IArtistRepository } from "../../domain/repositories/artist.repository";
import { ICacheService } from "../../domain/services/cache.service";
import { IEmailService } from "../../domain/services/mail.service";
import { IOtpService } from "../../domain/services/otp.service";
import { EmailFormat } from "../../infrastructure/services/email/email-format";
import logger from "../../infrastructure/utils/logger/logger";
import { SignupRequestDTO } from "../dto/auth/request.dto";
import { SignupResponseDTO } from "../dto/auth/response.dto";

export class ArtistSignupUsecase {
    constructor(
        private readonly artistRepository: IArtistRepository,
        private readonly cacheService: ICacheService,
        private readonly otpService: IOtpService,
        private readonly emailService: IEmailService
    ) {}

    async execute(request: SignupRequestDTO): Promise<SignupResponseDTO> {

        const existingUser = await this.artistRepository.findByEmail(request.email);
        if (existingUser) {
            throw new AlreadyExistError("Artist already exist in this email.!");
        }

        const otp = await this.otpService.generate();
        const cacheKey = `artist_otp:${request.email}`;
        const otpExpirationInSeconds = 300;
        const cachedData = { ...request, otp, otpExpiredAt: Date.now() + 2 * 60 * 1000, role: 'artist' };

        await this.cacheService.set(cacheKey, cachedData, otpExpirationInSeconds);
        
        const otpMail = EmailFormat.otp(otp);
        await this.emailService.sendMail(request.email, otpMail.subject, otpMail.text, otpMail.html);
        
        logger.info(`artist OTP: ${otp}`)
        return { otp };
    }
}
