import { MESSAGES } from "../../common/constants.message";
import { StatusCode } from "../../common/status.enum";
import { ICacheService } from "../../domain/services/cache.service";
import { IEmailService } from "../../domain/services/mail.service";
import { IOtpService } from "../../domain/services/otp.service";
import { EmailFormat } from "../../infrastructure/services/email/email-format";
import { ResendOtpRequestDTO } from "../dto/auth/request.dto";
import { ResendOtpResponseDTO } from "../dto/auth/response.dto";



export class ResendOtpUseCase {
    constructor(
        private readonly cacheService : ICacheService,
        private readonly otpService: IOtpService,
        private readonly emailService: IEmailService
    ){}

    async execute(request: ResendOtpRequestDTO) : Promise<ResendOtpResponseDTO>{
        
        const cacheKey = `otp:${request.email}`
        const otp = await this.otpService.generate()
        
        const otpExpiredAt = Date.now() + 60 * 1000

        const otpMail = EmailFormat.otp(otp)
        await this.emailService.sendMail(
            request.email,
            otpMail.subject,
            otpMail.text,
            otpMail.html
        )
        await this.cacheService.update(cacheKey,{otp, otpExpiredAt})

        return {otp}
    }
}