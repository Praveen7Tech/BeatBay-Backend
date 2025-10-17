import { MESSAGES } from "../../common/constants.message"
import { StatusCode } from "../../common/status.enum"
import { User } from "../../domain/entities/user.entity"
import { IUserRepository } from "../../domain/repositories/user.repository"
import { IPasswordService } from "../../domain/services/password.service"
import { ITokenService } from "../../domain/services/token.service"

interface LoginRequest {
    email: string,
    password: string
}

interface LoginResponse {
    user ?: User,
    status: StatusCode,
    message: string,
    accessToken?:string,
    refreshToken?:string
}

export class LoginUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly tokenService: ITokenService
    ){}

    async execute(request: LoginRequest) : Promise<LoginResponse> {

        const user = await this.userRepository.findByEmail(request.email)
        if(!user){
            return {status:StatusCode.NOT_FOUND, message: MESSAGES.USER_NOT_FOUND}
        }
        
        const password = await this.passwordService.compare(request.password, user.password)
        
        if(!password){
            return {status:StatusCode.BAD_REQUEST, message: MESSAGES.INVALID_CREDENTIALS}
        }

        const payload = {id: user._id, email: user.email}
        const accessToken = await this.tokenService.generateAccessToken(payload)
        const refreshToken = await this.tokenService.generateRefressToken(payload)

        return {
            status: StatusCode.OK,
            message: MESSAGES.USER_LOGIN,
            accessToken,
            refreshToken
        }
    }
}