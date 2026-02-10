import { ICacheService } from "../../../domain/services/cache.service"
import { IEmailService } from "../../../domain/services/mail.service"
import { IOtpService } from "../../../domain/services/otp.service"
import logger from "../../../infrastructure/utils/logger/logger"
import { ResendOtpRequestDTO } from "../../../application/dto/auth/request.dto"
import { ResendOtpResponseDTO } from "../../../application/dto/auth/response.dto"
import { IArtistResendOtpUseCase } from "../../../application/interfaces/usecase/artist/artist-resend-otp-usecase.interface"
import { EmailFormat } from "../../../infrastructure/utils/templates/email-templates"

export class ArtistResendOtpUseCase implements IArtistResendOtpUseCase{
    constructor(
        private readonly _cacheService : ICacheService,
        private readonly _otpService: IOtpService,
        private readonly _emailService: IEmailService
    ){}

    async execute(request: ResendOtpRequestDTO) : Promise<ResendOtpResponseDTO>{
        const cacheKey = `artist_otp:${request.email}`
        const otp = await this._otpService.generate()
        logger.info(`artist resend OTP: ${otp}`)
        const otpExpiredAt = Date.now() + 2 * 60 * 1000

        await this._cacheService.update(cacheKey,{otp, otpExpiredAt})

        const otpMail = EmailFormat.otp(otp)
        await this._emailService.sendMail(
            request.email,
            otpMail.subject,
            otpMail.text,
            otpMail.html
        )
        
        return {otp}
    }
}