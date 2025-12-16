import { ExpiredError } from "../../../common/errors/common/common.errors" 
import { IArtistRepository } from "../../../domain/repositories/artist.repository" 
import { ICacheService } from "../../../domain/services/cache.service" 
import { IPasswordService } from "../../../domain/services/password.service" 
import { ITokenService } from "../../../domain/services/token.service" 
import { ResetPasswordDTO } from "../../../application/dto/auth/request.dto" 

export class ArtistResetPasswordUsecase{
    constructor(
        private readonly _tokenService: ITokenService,
        private readonly _cacheService: ICacheService,
        private readonly _passwordService:IPasswordService,
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(request: ResetPasswordDTO): Promise<void> {
        
        const artistId = await this._tokenService.verifyResetToken(request.token)
        
        if(!artistId) throw new ExpiredError("this page is expired.")

        const cachedToken = await this._cacheService.getResetToken(artistId)
       
        if(!cachedToken || cachedToken !== request.token) throw new ExpiredError("this verification page has been expired..!");

        const hashedPassword = await this._passwordService.hash(request.password)

        //await this.artistRepository.update(artistId, {password:hashedPassword})
        await this._artistRepository.update(artistId, {password:hashedPassword})
        
        await this._cacheService.delete(artistId)
    }
}