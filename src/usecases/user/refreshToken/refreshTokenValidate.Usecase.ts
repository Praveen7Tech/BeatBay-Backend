import { RefreshTokenValidateResponse } from "../../../application/dto/auth/response.dto";
import { IRefreshTokenValidateUsecase } from "../../../application/interfaces/usecase/refreshToken/refreshToken-validate.usecase.interface";
import { BadRequestError, NotFoundError } from "../../../common/errors/common/common.errors";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ITokenService } from "../../../domain/services/token.service";


export class RefreshTokenValidateUseCase implements IRefreshTokenValidateUsecase{
    constructor(
        private readonly _tokenService: ITokenService,
        private readonly _userRepository: IUserRepository,
    ){}

    async execute(token: string): Promise<RefreshTokenValidateResponse> {
        
        const payload = await this._tokenService.verifyRefreshToken(token);
        if (!payload) {
            throw new BadRequestError("Invalid refresh token");
        }

        const user = await this._userRepository.findById(payload.id);
        if(!user){
            throw new NotFoundError("user not found")
        }

        const payloadTkn = { id: user._id.toString(), email: user.email, role:user.role };
        const newAccessToken = await this._tokenService.generateAccessToken(payloadTkn);
        const newRefreshToken = await this._tokenService.generateRefressToken(payloadTkn)

        return{
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }

    }
}