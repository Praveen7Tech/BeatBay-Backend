import { BadRequestError, UserNotFoundError } from "../../common/errors/user.auth.error"
import { IUserRepository } from "../../domain/repositories/user.repository"
import { IPasswordService } from "../../domain/services/password.service"
import { ITokenService } from "../../domain/services/token.service"
import { LoginRequestDTO } from "../auth/dto/request.dto"
import { LoginResponseDTO } from "../auth/dto/response.dto"
import { ROLES } from "../core/types/roles"

export class ArtistLoginUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly tokenService: ITokenService
    ){}

    async execute(request: LoginRequestDTO) : Promise<LoginResponseDTO> {
        
        const user = await this.userRepository.findByEmail(request.email)
        if(!user || user.role !== ROLES.ARTIST){
            throw new UserNotFoundError()
        }
        
        if(!user.password){
            throw new Error("Account uses Google login. Please continue with Google.")
        }
        const password = await this.passwordService.compare(request.password, user.password)
        
        if(!password){
            throw new BadRequestError()
        }

        const payload = {id: user._id, email: user.email}
        const accessToken = await this.tokenService.generateAccessToken(payload)
        const refreshToken = await this.tokenService.generateRefressToken(payload)

        return {
            user,
            accessToken,
            refreshToken
        }
    }
}