import { ICacheService } from "../../../domain/services/cache.service";
import { IEmailService } from "../../../domain/services/mail.service";
import { IOtpService } from "../../../domain/services/otp.service";
import { EmailFormat } from "../../../infrastructure/services/email/email-format";
import logger from "../../../infrastructure/utils/logger/logger";
import { ResendOtpRequestDTO } from "../../../application/dto/auth/request.dto";
import { ResendOtpResponseDTO } from "../../../application/dto/auth/response.dto";
import { IResendOtpUseCase } from "../../../application/interfaces/usecase/user-auth/resend-otp.-usecase.interface";



export class ResendOtpUseCase implements IResendOtpUseCase {
    constructor(
        private readonly _cacheService : ICacheService,
        private readonly _otpService: IOtpService,
        private readonly _emailService: IEmailService
    ){}

    async execute(request: ResendOtpRequestDTO) : Promise<ResendOtpResponseDTO>{
        
        const cacheKey = `otp:${request.email}`
        const otp = await this._otpService.generate()
        
        const otpExpiredAt = Date.now() + 60 * 1000

        const otpMail = EmailFormat.otp(otp)
        await this._emailService.sendMail(
            request.email,
            otpMail.subject,
            otpMail.text,
            otpMail.html
        )
        logger.info(`resend OTP: ${otp}`)
        await this._cacheService.update(cacheKey,{otp, otpExpiredAt})

        return {otp}
    }
}