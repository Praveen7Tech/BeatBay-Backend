import { ICacheService } from "../../domain/services/cache.service"
import { IEmailService } from "../../domain/services/mail.service"
import { IOtpService } from "../../domain/services/otp.service"
import { EmailFormat } from "../../infrastructure/services/email/email-format"
import { ResendOtpRequestDTO } from "../auth/dto/request.dto"
import { ResendOtpResponseDTO } from "../auth/dto/response.dto"

export class ArtistResendOtpUseCase {
    constructor(
        private readonly cacheService : ICacheService,
        private readonly otpService: IOtpService,
        private readonly emailService: IEmailService
    ){}

    async execute(request: ResendOtpRequestDTO) : Promise<ResendOtpResponseDTO>{
        const cacheKey = `artist_otp:${request.email}`
        const otp = await this.otpService.generate()
        
        const otpExpiredAt = Date.now() + 2 * 60 * 1000

        await this.cacheService.update(cacheKey,{otp, otpExpiredAt})

        const otpMail = EmailFormat.otp(otp)
        await this.emailService.sendMail(
            request.email,
            otpMail.subject,
            otpMail.text,
            otpMail.html
        )
        
        return {otp}
    }
}