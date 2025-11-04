import { User } from "../../domain/entities/user.entity"
import { IUserRepository } from "../../domain/repositories/user.repository"
import { ITokenService } from "../../domain/services/token.service"
import { AuthStatusRequestDTO } from "../dto/auth/request.dto"
import { AuthStatusResponseDTO } from "../dto/auth/response.dto";



export class AuthStatusUsecase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepository: IUserRepository
  ){}

  async execute(request: AuthStatusRequestDTO) : Promise<AuthStatusResponseDTO> {

    const payload: any = await this.tokenService.verifyRefreshToken(request.refreshToken);
    if (!payload) {
      throw new Error("Invalid refresh token");
    }

    const user = await this.userRepository.findById(payload.id);
    if (!user) {
      throw new Error("User not found using refresh token");
    }

    const payloadTkn = { id: user._id, email: user.email };
    const newAccessToken = await this.tokenService.generateAccessToken(payloadTkn);
    const newRefreshToken = await this.tokenService.generateRefressToken(payloadTkn)

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken};
  }
}
