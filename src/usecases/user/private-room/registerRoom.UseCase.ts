import { IMutualFriendsStatusUseCase } from "../../../application/interfaces/usecase/mutual-friends/mutual-friends-status-usecase.interface";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class RegisterUserUseCase {
  constructor(
    private readonly socketCacheService: ISocketCacheService,
    private readonly friends: IMutualFriendsStatusUseCase
  ) {}

  async execute(userId: string) {
    const roomId = await this.socketCacheService.getUserActiveRooms(userId);
    const roomData = roomId ? await this.socketCacheService.getRoom(roomId) : null;
    const friendsMap = await this.friends.execute(userId);

    return { roomData, friendsMap };
  }
}
