import { ExpiredError } from "../../common/errors/common/common.errors";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ICacheService } from "../../domain/services/cache.service";
import { IPasswordService } from "../../domain/services/password.service";
import { ITokenService } from "../../domain/services/token.service";
import { ResetPasswordDTO } from "../dto/auth/request.dto";


export class ResetPasswordUsecase{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly tokenService: ITokenService,
        private readonly cacheService: ICacheService,
        private readonly passwordService: IPasswordService
    ){}

    async execute(request: ResetPasswordDTO): Promise<void> {
        
        const userId = await this.tokenService.verifyResetToken(request.token)
        
        if(!userId) throw new ExpiredError("this page is expired.")

        const cachedToken = await this.cacheService.getResetToken(userId)
       
        if(!cachedToken || cachedToken !== request.token) throw new ExpiredError("this verification page has been expired..!");
        

        const hashedPassword = await this.passwordService.hash(request.password)
     
        await this.userRepository.update(userId, {password:hashedPassword})
        
        await this.cacheService.delete(userId)
    }
}