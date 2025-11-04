import { IUserRepository } from "../../domain/repositories/user.repository";
import { IGoogleAuthService } from "../../domain/services/google-auth.service";
import { ITokenService } from "../../domain/services/token.service";
import { GoogleLoginRequestDTO } from "../dto/auth/request.dto"; 

export class ArtistGoogleLoginUseCase {
  constructor(
    private readonly googleAuthService: IGoogleAuthService,
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(request: GoogleLoginRequestDTO) {
    console.log("artist 2 ")
    const payload = await this.googleAuthService.verifyToken(request.token);
    const { name, email, picture, sub } = payload;

    if (!email) {
      throw new Error("Google account did not return an email");
    }

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
        
      user = await this.userRepository.create({
        name ,
        email,
        password:null,
        googleId:sub,
        profilePicture: picture,
        role: 'artist',
      });
    }

    const payloadt = { id: user._id!, email: user.email };
    const accessToken = await this.tokenService.generateAccessToken(payloadt);
    const refreshToken = await this.tokenService.generateRefressToken(payloadt);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
