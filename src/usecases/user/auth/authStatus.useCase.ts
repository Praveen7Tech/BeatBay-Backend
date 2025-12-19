import { BadRequestError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository"
import { ITokenService } from "../../../domain/services/token.service"
import { AuthStatusRequestDTO } from "../../../application/dto/auth/request.dto"
import { LoginResponseDTO, RoomData } from "../../../application/dto/auth/response.dto";
import { AuthMapper } from "../../../application/mappers/user/auth.mapper";
import { Artist } from "../../../domain/entities/arist.entity";
import { User } from "../../../domain/entities/user.entity";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";



export class AuthStatusUsecase {
  constructor(
    private readonly _tokenService: ITokenService,
    private readonly _userRepository: IUserRepository,
    private readonly _artistRepository: IArtistRepository,
    private readonly _cacheRoomService: ISocketCacheService
  ){}

  async execute(request: AuthStatusRequestDTO) : Promise<LoginResponseDTO> {

    const payload = await this._tokenService.verifyRefreshToken(request.refreshToken);
    if (!payload) {
      throw new BadRequestError("Invalid refresh token");
    }

    let userEntity;
    if(payload.role === "user"){
      userEntity = await this._userRepository.findById(payload.id);
    }else if( payload.role === 'admin'){
      userEntity = await this._userRepository.findById(payload.id);
    }else if(payload.role === 'artist'){
      userEntity = await this._artistRepository.findById(payload.id)
    }
    
    if (!userEntity || !userEntity._id) {
      throw new BadRequestError("User not found using refresh token");
    }

    let roomData : RoomData | null = null
    const roomId = await this._cacheRoomService.getUserActiveRooms(payload.id)
    if(roomId){
       roomData = await this._cacheRoomService.getRoom(roomId)
    }

    const payloadTkn = { id: userEntity._id.toString(), email: userEntity.email, role:userEntity.role };
    const newAccessToken = await this._tokenService.generateAccessToken(payloadTkn);
    const newRefreshToken = await this._tokenService.generateRefressToken(payloadTkn)

    const mappedUser = userEntity.role === 'artist'
      ? AuthMapper.toAuthArtistDTO(userEntity as Artist)
      : AuthMapper.toAuthUserDTO(userEntity as User);

    return { 
      user: mappedUser, 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken,
      roomState: roomData
    };
  }
}
