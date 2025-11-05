import { email } from "zod";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { IPasswordService } from "../../domain/services/password.service";
import { ITokenService } from "../../domain/services/token.service";
import { LoginRequestDTO } from "../dto/auth/request.dto";
import { LoginResponseDTO } from "../dto/auth/response.dto";
import { ROLES } from "../core/types/roles";
import { BadRequestError, NotFoundError } from "../../common/errors/common/common.errors";


export class AdminLoginUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly tokenService: ITokenService
    ){}

    async execute(request: LoginRequestDTO): Promise<LoginResponseDTO> {
        
        const user = await this.userRepository.findByEmail(request.email)

        if(!user || !user.password){
            throw new NotFoundError("Admin not found.!")
        }

        const passwordMatch = await this.passwordService.compare(request.password, user.password)
        if(!passwordMatch){
            throw new BadRequestError("invalid admin credentials.!")
        }

        const payload = {id: user._id, email: user.email, role: user.role}
        const accessToken = await this.tokenService.generateAccessToken(payload)
        const refreshToken = await this.tokenService.generateRefressToken(payload)

        return {user, accessToken, refreshToken}
    }
}