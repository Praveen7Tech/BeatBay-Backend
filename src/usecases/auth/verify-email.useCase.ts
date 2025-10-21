import { UserNotFoundError } from "../../common/errors/user.auth.error";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ICacheService } from "../../domain/services/cache.service";
import { IEmailService } from "../../domain/services/mail.service";
import { ITokenService } from "../../domain/services/token.service";
import { passwordResetFormat } from "../../infrastructure/services/email/email-format";
import { VerifyEmailRequestDTO } from "./dto/request.dto";


export class VerifyEmailUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly emailService: IEmailService,
        private readonly tokenService: ITokenService,
        private readonly cacheService: ICacheService
    ){}

    async execute(request: VerifyEmailRequestDTO): Promise<void> {
        
        const user =  await this.userRepository.findByEmail(request.email)
        if(!user) throw new UserNotFoundError()
        
        const token = await this.tokenService.generateResetToken(user.email)
        
        await this.cacheService.storeResetToken(user.email,token,10*60)
        
        const restLink = `http://localhost:5173/reset-password?token=${token}`
        const restMail = passwordResetFormat.link(restLink)
        
        await this.emailService.sendMail(request.email, restMail.subject, restMail.text, restMail.html)
        
    }
}