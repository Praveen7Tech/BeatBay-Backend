
import { IPasswordService } from "../../../domain/services/password.service"
import { ITokenService } from "../../../domain/services/token.service"
import { LoginRequestDTO } from "../../../application/dto/auth/request.dto"
import { LoginResponseDTO } from "../../../application/dto/auth/response.dto"
import { BadRequestError, BlockedAccountError, NotFoundError } from "../../../common/errors/common/common.errors"
import { IArtistRepository } from "../../../domain/repositories/artist.repository"
import { AuthMapper } from "../../../application/mappers/user/auth/auth.mapper"
import { IArtistLoginUsecase } from "../../../application/interfaces/usecase/artist/artist-loin-usecase.interface"

export class ArtistLoginUsecase implements IArtistLoginUsecase{
    constructor(
        private readonly _artistRepository: IArtistRepository,
        private readonly _passwordService: IPasswordService,
        private readonly _tokenService: ITokenService
    ){}

    async execute(request: LoginRequestDTO) : Promise<LoginResponseDTO> {
        
        const artist = await this._artistRepository.findByEmail(request.email)
        if(!artist){
            throw new NotFoundError("Artist not found.!")
        }

        if(artist && !artist.status){
            throw new BlockedAccountError()
        }
        
        if(!artist.password || !artist._id){
            throw new NotFoundError("Account uses Google login. Please continue with Google.")
        }
        const password = await this._passwordService.compare(request.password, artist.password)
        
        if(!password){
            throw new BadRequestError("Invalid credentials")
        }

        const payload = {id: artist._id?.toString(), email: artist.email, role: artist.role}
        const accessToken = await this._tokenService.generateAccessToken(payload)
        const refreshToken = await this._tokenService.generateRefressToken(payload)

        const artistData = AuthMapper.toAuthArtistDTO(artist)

        return {
            user:artistData,
            accessToken,
            refreshToken
        }
    }
}