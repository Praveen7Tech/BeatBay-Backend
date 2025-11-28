import { BadRequestError, BlockedAccountError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IGoogleAuthService } from "../../../domain/services/google-auth.service";
import { ITokenService } from "../../../domain/services/token.service";
import { GoogleLoginRequestDTO } from "../../dto/auth/request.dto"; 

export class ArtistGoogleLoginUseCase {
  constructor(
    private readonly googleAuthService: IGoogleAuthService,
    private readonly artistRepository: IArtistRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(request: GoogleLoginRequestDTO) {

    const payload = await this.googleAuthService.verifyToken(request.token);
    const { name, email, picture, sub } = payload;

    if (!email || !name) {
      throw new BadRequestError("Google account did not return an email");
    }

    let artist = await this.artistRepository.findByEmail(email);

    if (!artist) {
        
      artist = await this.artistRepository.create({
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
    const accessToken = await this.tokenService.generateAccessToken(payloadt);
    const refreshToken = await this.tokenService.generateRefressToken(payloadt);

    return {
      user:artist,
      accessToken,
      refreshToken,
    };
  }
}
