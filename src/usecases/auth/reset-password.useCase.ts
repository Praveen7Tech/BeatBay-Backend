import { IUserRepository } from "../../domain/repositories/user.repository";
import { ICacheService } from "../../domain/services/cache.service";
import { IPasswordService } from "../../domain/services/password.service";
import { ITokenService } from "../../domain/services/token.service";
import { ResetPasswordDTO } from "./dto/request.dto";


export class ResetPasswordUsecase{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly tokenService: ITokenService,
        private readonly cacheService: ICacheService,
        private readonly passwordService: IPasswordService
    ){}

    async execute(request: ResetPasswordDTO): Promise<void> {
        
        const userEmail = await this.tokenService.verifyResetToken(request.token)
        console.log("email ", userEmail)
        if(!userEmail) throw new Error("this page is expired.")

        const cachedToken = await this.cacheService.getResetToken(userEmail)
        console.log("cache tok ", cachedToken)
        if(!cachedToken || cachedToken !== request.token) throw new Error("this verification page has been expired..!");

        const hashedPassword = await this.passwordService.hash(request.password)

        await this.userRepository.update(userEmail, {password:hashedPassword})
        console.log("update complete")
        await this.cacheService.delete(userEmail)
    }
}