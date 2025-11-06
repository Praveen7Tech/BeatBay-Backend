import { ExpiredError } from "../../common/errors/common/common.errors";
import { IArtistRepository } from "../../domain/repositories/artist.repository";
import { ICacheService } from "../../domain/services/cache.service";
import { IPasswordService } from "../../domain/services/password.service";
import { ITokenService } from "../../domain/services/token.service";
import { ResetPasswordDTO } from "../dto/auth/request.dto";

export class ArtistResetPasswordUsecase{
    constructor(
        private readonly tokenService: ITokenService,
        private readonly cacheService: ICacheService,
        private readonly passwordService:IPasswordService,
        private readonly artistRepository: IArtistRepository
    ){}

    async execute(request: ResetPasswordDTO): Promise<void> {
        
        const userEmail = await this.tokenService.verifyResetToken(request.token)
        
        if(!userEmail) throw new ExpiredError("this page is expired.")

        const cachedToken = await this.cacheService.getResetToken(userEmail)
       
        if(!cachedToken || cachedToken !== request.token) throw new ExpiredError("this verification page has been expired..!");

        const hashedPassword = await this.passwordService.hash(request.password)

        await this.artistRepository.updatePass(userEmail, {password:hashedPassword})
        
        await this.cacheService.delete(userEmail)
    }
}