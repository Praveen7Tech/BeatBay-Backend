import { BadRequestError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository"
import { ITokenService } from "../../../domain/services/token.service"
import { AuthStatusRequestDTO } from "../../dto/auth/request.dto"
import { AuthStatusResponseDTO } from "../../dto/auth/response.dto";



export class AuthStatusUsecase {
  constructor(
    private readonly _tokenService: ITokenService,
    private readonly _userRepository: IUserRepository,
    private readonly _artistRepository: IArtistRepository
  ){}

  async execute(request: AuthStatusRequestDTO) : Promise<AuthStatusResponseDTO> {

    const payload = await this._tokenService.verifyRefreshToken(request.refreshToken);
    if (!payload) {
      throw new BadRequestError("Invalid refresh token");
    }

    let user;
    if(payload.role === "user"){
      user = await this._userRepository.findById(payload.id);
    }else if( payload.role === 'admin'){
      user = await this._userRepository.findById(payload.id);
    }else if(payload.role === 'artist'){
      user = await this._artistRepository.findById(payload.id)
    }
    
    if (!user || !user._id) {
      throw new BadRequestError("User not found using refresh token");
    }

    const payloadTkn = { id: user._id.toString(), email: user.email, role:user.role };
    const newAccessToken = await this._tokenService.generateAccessToken(payloadTkn);
    const newRefreshToken = await this._tokenService.generateRefressToken(payloadTkn)

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken};
  }
}
