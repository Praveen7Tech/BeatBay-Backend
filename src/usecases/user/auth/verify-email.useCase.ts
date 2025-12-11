
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ICacheService } from "../../../domain/services/cache.service";
import { IEmailService } from "../../../domain/services/mail.service";
import { ITokenService } from "../../../domain/services/token.service";
import { passwordResetFormat } from "../../../infrastructure/services/email/email-format";
import { VerifyEmailRequestDTO } from "../../dto/auth/request.dto";


export class VerifyEmailUsecase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _emailService: IEmailService,
        private readonly _tokenService: ITokenService,
        private readonly _cacheService: ICacheService
    ){}

    async execute(request: VerifyEmailRequestDTO): Promise<void> {
        
        const user =  await this._userRepository.findByEmail(request.email)
        
        if(!user || !user._id) throw new NotFoundError("User not found")
        
        const userIdString: string = user._id.toString()  
        
        const token = await this._tokenService.generateResetToken(userIdString)
        
        await this._cacheService.storeResetToken(userIdString,token,10*60)
        
        const restLink = `http://localhost:5173/reset-password?token=${token}`
        const restMail = passwordResetFormat.link(restLink)
        
        await this._emailService.sendMail(request.email, restMail.subject, restMail.text, restMail.html)
        
    }
}