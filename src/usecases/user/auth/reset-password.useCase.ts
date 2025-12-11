import { ExpiredError } from "../../../common/errors/common/common.errors";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ICacheService } from "../../../domain/services/cache.service";
import { IPasswordService } from "../../../domain/services/password.service";
import { ITokenService } from "../../../domain/services/token.service";
import { ResetPasswordDTO } from "../../dto/auth/request.dto";


export class ResetPasswordUsecase{
    constructor(
        private readonly _userRepository:IUserRepository,
        private readonly _tokenService: ITokenService,
        private readonly _cacheService: ICacheService,
        private readonly _passwordService: IPasswordService
    ){}

    async execute(request: ResetPasswordDTO): Promise<void> {
        
        const userId = await this._tokenService.verifyResetToken(request.token)
        
        if(!userId) throw new ExpiredError("this page is expired.")

        const cachedToken = await this._cacheService.getResetToken(userId)
       
        if(!cachedToken || cachedToken !== request.token) throw new ExpiredError("this verification page has been expired..!");
        

        const hashedPassword = await this._passwordService.hash(request.password)
     
        await this._userRepository.update(userId, {password:hashedPassword})
        
        await this._cacheService.delete(userId)
    }
}