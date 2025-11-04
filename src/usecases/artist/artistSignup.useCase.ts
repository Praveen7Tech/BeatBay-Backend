// src/usecases/artist/artistSignup.useCase.ts
import { UserAlreadyExistsError } from "../../common/errors/user.auth.error";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ICacheService } from "../../domain/services/cache.service";
import { IEmailService } from "../../domain/services/mail.service";
import { IOtpService } from "../../domain/services/otp.service";
import { EmailFormat } from "../../infrastructure/services/email/email-format";
import { SignupRequestDTO } from "../dto/auth/request.dto";
import { SignupResponseDTO } from "../dto/auth/response.dto";

export class ArtistSignupUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly cacheService: ICacheService,
        private readonly otpService: IOtpService,
        private readonly emailService: IEmailService
    ) {}

    async execute(request: SignupRequestDTO): Promise<SignupResponseDTO> {
        // Correct: Check for existing USER by email, not artist.
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new UserAlreadyExistsError();
        }

        const otp = await this.otpService.generate();
        const cacheKey = `artist_otp:${request.email}`;
        const otpExpirationInSeconds = 300;
        const cachedData = { ...request, otp, otpExpiredAt: Date.now() + 2 * 60 * 1000, role: 'artist' };

        await this.cacheService.set(cacheKey, cachedData, otpExpirationInSeconds);
        
        const otpMail = EmailFormat.otp(otp);
        await this.emailService.sendMail(request.email, otpMail.subject, otpMail.text, otpMail.html);
        
        console.log("artist otp ", otp)
        return { otp };
    }
}
