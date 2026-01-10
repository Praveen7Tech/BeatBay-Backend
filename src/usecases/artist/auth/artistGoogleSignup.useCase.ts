import { BadRequestError, BlockedAccountError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IGoogleAuthService } from "../../../domain/services/google-auth.service";
import { ITokenService } from "../../../domain/services/token.service";
import { GoogleLoginRequestDTO } from "../../../application/dto/auth/request.dto"; 
import { IArtistGoogleLoginUseCase } from "../../../application/interfaces/usecase/artist/artist-google-login-usecase.interface";
import { LoginResponseDTO } from "../../../application/dto/auth/response.dto";
import { AuthMapper } from "../../../application/mappers/user/auth/auth.mapper";

export class ArtistGoogleLoginUseCase implements IArtistGoogleLoginUseCase{
  constructor(
    private readonly _googleAuthService: IGoogleAuthService,
    private readonly _artistRepository: IArtistRepository,
    private readonly _tokenService: ITokenService,
  ) {}

  async execute(request: GoogleLoginRequestDTO):Promise<LoginResponseDTO> {

    const payload = await this._googleAuthService.verifyToken(request.token);
    const { name, email, picture, sub } = payload;

    if (!email || !name) {
      throw new BadRequestError("Google account did not return an email");
    }

    let artist = await this._artistRepository.findByEmail(email);

    if (!artist) {
        
      artist = await this._artistRepository.create({
        name ,
        email,
        password:null,
        googleId:sub,
        profilePicture: null,
        role: 'artist',
      });
    }

    if(artist && !artist.status){
        throw new BlockedAccountError()
    }
    
    const payloadt = { id: artist._id!, email: artist.email, role:artist.role };
    const accessToken = await this._tokenService.generateAccessToken(payloadt);
    const refreshToken = await this._tokenService.generateRefressToken(payloadt);

    return {
      user: AuthMapper.toAuthArtistDTO(artist),
      accessToken,
      refreshToken,
    };
  }
}
