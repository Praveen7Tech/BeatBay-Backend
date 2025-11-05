import { NotFoundError } from "../../common/errors/common/common.errors"
import { IArtistRepository } from "../../domain/repositories/artist.repository"
import { ICacheService } from "../../domain/services/cache.service"
import { IEmailService } from "../../domain/services/mail.service"
import { ITokenService } from "../../domain/services/token.service"
import { passwordResetFormat } from "../../infrastructure/services/email/email-format"
import { VerifyEmailRequestDTO } from "../dto/auth/request.dto"

export class ArtistVerifyEmailUsecase {
    constructor(
        private readonly artistRepository: IArtistRepository,
        private readonly tokenService: ITokenService,
        private readonly cacheService: ICacheService,
        private readonly emailService: IEmailService
    ){}

    async execute(request: VerifyEmailRequestDTO): Promise<void> {
            
        const user =  await this.artistRepository.findByEmail(request.email)
        if(!user) throw new NotFoundError("Artist not found")
            
        const token = await this.tokenService.generateResetToken(user.email)
            
        await this.cacheService.storeResetToken(user.email,token,10*60)
            
        const restLink = `http://localhost:5173/artist-reset-password?token=${token}`
        const restMail = passwordResetFormat.link(restLink)
            
        await this.emailService.sendMail(request.email, restMail.subject, restMail.text, restMail.html)
            
    }
}