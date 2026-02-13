import { IRegisterUserUseCase } from "../../../application/interfaces/usecase/private-room/register-user-usecase.interface";
import { ISocketCacheService, RoomData } from "../../../domain/services/redis/jamCache.service";

export class RegisterUserUseCase implements IRegisterUserUseCase{
  constructor(
    private readonly _socketCacheService: ISocketCacheService,
  ) {}

  async execute(userId: string): Promise<RoomData | null> {

    await this._socketCacheService.setUserOnline(userId)

    const roomId = await this._socketCacheService.getUserActiveRooms(userId);
    const roomData = roomId ? await this._socketCacheService.getRoom(roomId) : null;

    return roomData
  }
}
