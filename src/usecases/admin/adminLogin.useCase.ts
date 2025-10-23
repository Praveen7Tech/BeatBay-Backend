import { email } from "zod";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { IPasswordService } from "../../domain/services/password.service";
import { ITokenService } from "../../domain/services/token.service";
import { LoginRequestDTO } from "../auth/dto/request.dto";
import { LoginResponseDTO } from "../auth/dto/response.dto";
import { ROLES } from "../core/types/roles";


export class AdminLoginUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly tokenService: ITokenService
    ){}

    async execute(request: LoginRequestDTO): Promise<LoginResponseDTO> {
        
        const user = await this.userRepository.findByEmail(request.email)

        if(!user || user.role !== ROLES.ADMIN || !user.password){
            throw new Error("admin not found..")
        }

        const passwordMatch = await this.passwordService.compare(request.password, user.password)
        if(!passwordMatch){
            throw new Error("invalid credentials..")
        }
        console.log("pass ",passwordMatch,request.password, user.password)

        const payload = {id: user._id, email: user.email, role: user.role}
        const accessToken = await this.tokenService.generateAccessToken(payload)
        const refreshToken = await this.tokenService.generateRefressToken(payload)

        return {user, accessToken, refreshToken}
    }
}