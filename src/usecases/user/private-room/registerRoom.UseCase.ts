import { RegisterUserResponseDTO } from "../../../application/dto/private-room/register-user.dto";
import { IMutualFriendsStatusUseCase } from "../../../application/interfaces/usecase/mutual-friends/mutual-friends-status-usecase.interface";
import { IRegisterUserUseCase } from "../../../application/interfaces/usecase/private-room/register-user-usecase.interface";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class RegisterUserUseCase implements IRegisterUserUseCase{
  constructor(
    private readonly _socketCacheService: ISocketCacheService,
    private readonly _friendsStatusUsecase: IMutualFriendsStatusUseCase
  ) {}

  async execute(userId: string): Promise<RegisterUserResponseDTO> {
    const roomId = await this._socketCacheService.getUserActiveRooms(userId);
    const roomData = roomId ? await this._socketCacheService.getRoom(roomId) : null;
    const friendsMap = await this._friendsStatusUsecase.execute(userId);

    return { roomData, friendsMap };
  }
}
