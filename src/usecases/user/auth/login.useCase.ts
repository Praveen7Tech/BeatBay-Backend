import { BadRequestError, BlockedAccountError, NotFoundError } from "../../../common/errors/common/common.errors"
import { IUserRepository } from "../../../domain/repositories/user.repository"
import { IPasswordService } from "../../../domain/services/password.service"
import { ITokenService } from "../../../domain/services/token.service"
import { ROLES } from "../../core/types/roles"
import { LoginRequestDTO } from "../../dto/auth/request.dto"
import { LoginResponseDTO } from "../../dto/auth/response.dto"


export class LoginUsecase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _passwordService: IPasswordService,
        private readonly _tokenService: ITokenService
    ){}

    async execute(request: LoginRequestDTO) : Promise<LoginResponseDTO> {
        
        const user = await this._userRepository.findByEmail(request.email)
        if(!user || user.role !== ROLES.USER){
            throw new NotFoundError("User not found.!")
        }

        if(user && !user.status){
            throw new BlockedAccountError()
        }
        
        if(!user.password || !user._id){
            throw new BadRequestError("Account uses Google login. Please continue with Google.")
        }
        const password = await this._passwordService.compare(request.password, user.password)
        
        if(!password){
            throw new BadRequestError("Invalid user credentials.!")
        }

        const payload = {id: user._id?.toString(), email: user.email, role:user.role}
        const accessToken = await this._tokenService.generateAccessToken(payload)
        const refreshToken = await this._tokenService.generateRefressToken(payload)

        return {
            user,
            accessToken,
            refreshToken
        }
    }
}