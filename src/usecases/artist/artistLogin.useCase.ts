
import { IPasswordService } from "../../domain/services/password.service"
import { ITokenService } from "../../domain/services/token.service"
import { LoginRequestDTO } from "../dto/auth/request.dto"
import { LoginResponseDTO } from "../dto/auth/response.dto"
import { BadRequestError, NotFoundError } from "../../common/errors/common/common.errors"
import { IArtistRepository } from "../../domain/repositories/artist.repository"

export class ArtistLoginUsecase {
    constructor(
        private readonly artistRepository: IArtistRepository,
        private readonly passwordService: IPasswordService,
        private readonly tokenService: ITokenService
    ){}

    async execute(request: LoginRequestDTO) : Promise<LoginResponseDTO> {
        
        const artist = await this.artistRepository.findByEmail(request.email)
        if(!artist){
            throw new NotFoundError("Artist not found.!")
        }
        
        if(!artist.password || !artist._id){
            throw new NotFoundError("Account uses Google login. Please continue with Google.")
        }
        const password = await this.passwordService.compare(request.password, artist.password)
        
        if(!password){
            throw new BadRequestError("Invalid credentials")
        }

        const payload = {id: artist._id?.toString(), email: artist.email, role: artist.role}
        const accessToken = await this.tokenService.generateAccessToken(payload)
        const refreshToken = await this.tokenService.generateRefressToken(payload)

        return {
            user:artist,
            accessToken,
            refreshToken
        }
    }
}