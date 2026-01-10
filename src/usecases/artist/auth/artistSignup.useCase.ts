
import { AlreadyExistError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ICacheService } from "../../../domain/services/cache.service";
import { IEmailService } from "../../../domain/services/mail.service";
import { IOtpService } from "../../../domain/services/otp.service";
import { EmailFormat } from "../../../infrastructure/services/email/email-format";
import logger from "../../../infrastructure/utils/logger/logger";
import { SignupRequestDTO } from "../../../application/dto/auth/request.dto";
import { SignupResponseDTO } from "../../../application/dto/auth/response.dto";
import { IArtistSignupUsecase } from "../../../application/interfaces/usecase/artist/artist-signup-usecase.interface";

export class ArtistSignupUsecase implements IArtistSignupUsecase{
    constructor(
        private readonly _artistRepository: IArtistRepository,
        private readonly _cacheService: ICacheService,
        private readonly _otpService: IOtpService,
        private readonly _emailService: IEmailService
    ) {}

    async execute(request: SignupRequestDTO): Promise<SignupResponseDTO> {

        const existingUser = await this._artistRepository.findByEmail(request.email);
        if (existingUser) {
            throw new AlreadyExistError("Artist already exist in this email.!");
        }

        const otp = await this._otpService.generate();
        const cacheKey = `artist_otp:${request.email}`;
        const otpExpirationInSeconds = 300;
        const cachedData = { ...request, otp, otpExpiredAt: Date.now() + 2 * 60 * 1000, role: 'artist' };

        await this._cacheService.set(cacheKey, cachedData, otpExpirationInSeconds);
        
        const otpMail = EmailFormat.otp(otp);
        await this._emailService.sendMail(request.email, otpMail.subject, otpMail.text, otpMail.html);
        
        logger.info(`artist OTP: ${otp}`)
        return { otp };
    }
}
