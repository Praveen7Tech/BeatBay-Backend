import { BadRequestError } from "../../common/errors/common/common.errors";
import { User } from "../../domain/entities/user.entity"
import { IArtistRepository } from "../../domain/repositories/artist.repository";
import { IUserRepository } from "../../domain/repositories/user.repository"
import { ITokenService } from "../../domain/services/token.service"
import { AuthStatusRequestDTO } from "../dto/auth/request.dto"
import { AuthStatusResponseDTO } from "../dto/auth/response.dto";



export class AuthStatusUsecase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepository: IUserRepository,
    private readonly artistRepository: IArtistRepository
  ){}

  async execute(request: AuthStatusRequestDTO) : Promise<AuthStatusResponseDTO> {

    const payload: any = await this.tokenService.verifyRefreshToken(request.refreshToken);
    if (!payload) {
      throw new BadRequestError("Invalid refresh token");
    }
    console.log("payload ",payload)

    let user;
    if(payload.role === "user"){
      user = await this.userRepository.findById(payload.id);
    }else if( payload.role === 'admin'){
      user = await this.userRepository.findById(payload.id);
    }else if(payload.role === 'artist'){
      user = await this.artistRepository.findById(payload.id)
    }
    
    if (!user) {
      throw new BadRequestError("User not found using refresh token");
    }

    const payloadTkn = { id: user._id, email: user.email, role:user.role };
    const newAccessToken = await this.tokenService.generateAccessToken(payloadTkn);
    const newRefreshToken = await this.tokenService.generateRefressToken(payloadTkn)

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken};
  }
}
