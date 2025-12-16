import { NotFoundError } from "../../../common/errors/common/common.errors"
import { IArtistRepository } from "../../../domain/repositories/artist.repository"
import { ICacheService } from "../../../domain/services/cache.service"
import { IEmailService } from "../../../domain/services/mail.service"
import { ITokenService } from "../../../domain/services/token.service"
import { passwordResetFormat } from "../../../infrastructure/services/email/email-format"
import { VerifyEmailRequestDTO } from "../../../application/dto/auth/request.dto"

export class ArtistVerifyEmailUsecase {
    constructor(
        private readonly _artistRepository: IArtistRepository,
        private readonly _tokenService: ITokenService,
        private readonly _cacheService: ICacheService,
        private readonly _emailService: IEmailService
    ){}

    async execute(request: VerifyEmailRequestDTO): Promise<void> {
            
        const artist =  await this._artistRepository.findByEmail(request.email)
        if(!artist || !artist._id) throw new NotFoundError("Artist not found")
            
        const artistId :string = artist._id?.toString()    
        const token = await this._tokenService.generateResetToken(artistId)
            
        await this._cacheService.storeResetToken(artistId,token,10*60)
            
        const restLink = `http://localhost:5173/artist-reset-password?token=${token}`
        const restMail = passwordResetFormat.link(restLink)
            
        await this._emailService.sendMail(request.email, restMail.subject, restMail.text, restMail.html)
            
    }
}