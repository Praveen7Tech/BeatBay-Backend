import { MESSAGES } from "../../common/constants/constants.message"
import { BadRequestError, NotFoundError } from "../../common/errors/common/common.errors"
import { StatusCode } from "../../common/constants/status.enum"
import { User } from "../../domain/entities/user.entity"
import { IUserRepository } from "../../domain/repositories/user.repository"
import { IPasswordService } from "../../domain/services/password.service"
import { ITokenService } from "../../domain/services/token.service"
import { ROLES } from "../core/types/roles"
import { LoginRequestDTO } from "../dto/auth/request.dto"
import { LoginResponseDTO } from "../dto/auth/response.dto"


export class LoginUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly tokenService: ITokenService
    ){}

    async execute(request: LoginRequestDTO) : Promise<LoginResponseDTO> {
        
        const user = await this.userRepository.findByEmail(request.email)
        if(!user || user.role !== ROLES.USER){
            throw new NotFoundError("User not found.!")
        }
        
        if(!user.password || !user._id){
            throw new BadRequestError("Account uses Google login. Please continue with Google.")
        }
        const password = await this.passwordService.compare(request.password, user.password)
        
        if(!password){
            throw new BadRequestError("Invalid user credentials.!")
        }

        const payload = {id: user._id?.toString(), email: user.email, role:user.role}
        const accessToken = await this.tokenService.generateAccessToken(payload)
        const refreshToken = await this.tokenService.generateRefressToken(payload)

        return {
            user,
            accessToken,
            refreshToken
        }
    }
}