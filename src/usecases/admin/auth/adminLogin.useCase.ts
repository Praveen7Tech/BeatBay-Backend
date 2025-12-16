
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IPasswordService } from "../../../domain/services/password.service";
import { ITokenService } from "../../../domain/services/token.service";
import { LoginRequestDTO } from "../../../application/dto/auth/request.dto";
import { LoginResponseDTO } from "../../../application/dto/auth/response.dto";
import { BadRequestError, NotFoundError } from "../../../common/errors/common/common.errors";
import { AuthMapper } from "../../../application/mappers/user/auth.mapper";


export class AdminLoginUsecase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _passwordService: IPasswordService,
        private readonly _tokenService: ITokenService
    ){}

    async execute(request: LoginRequestDTO): Promise<LoginResponseDTO> {
        
        const admin = await this._userRepository.findByEmail(request.email)

        if(!admin || !admin.password || admin.role !== 'admin' || !admin._id){
            throw new NotFoundError("Admin not found.!")
        }

        const passwordMatch = await this._passwordService.compare(request.password, admin.password)
        if(!passwordMatch){
            throw new BadRequestError("invalid admin credentials.!")
        }

        const payload = {id: admin._id?.toString(), email: admin.email, role: admin.role}
        const accessToken = await this._tokenService.generateAccessToken(payload)
        const refreshToken = await this._tokenService.generateRefressToken(payload)

        const adminData = AuthMapper.toAuthUserDTO(admin)

        return {user:adminData, accessToken, refreshToken}
    }
}