import { BadRequestError, BlockedAccountError } from "../../../common/errors/common/common.errors";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IGoogleAuthService } from "../../../domain/services/google-auth.service";
import { ITokenService } from "../../../domain/services/token.service";
import { GoogleLoginRequestDTO } from "../../dto/auth/request.dto";

export class GoogleLoginUsecase {
  constructor(
    private readonly _googleAuthService: IGoogleAuthService,
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService,
  ) {}

  async execute(request: GoogleLoginRequestDTO) {
    const payload = await this._googleAuthService.verifyToken(request.token);
    const { name, email, picture, sub } = payload;

    if (!email) {
      throw new BadRequestError("Google account did not return an email");
    }

    let user = await this._userRepository.findByEmail(email);

    if (!user) {
        
      user = await this._userRepository.create({
        name,
        email,
        password: null,
        googleId: sub,
        playLists: [],
        profilePicture: picture,
        role: 'user',
        profileImagePublicId: null
      });
    }

    if(user && !user.status){
        throw new BlockedAccountError()
    }

    const payloadt = { id: user._id!, email: user.email, role: user.role };
    const accessToken = await this._tokenService.generateAccessToken(payloadt);
    const refreshToken = await this._tokenService.generateRefressToken(payloadt);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
