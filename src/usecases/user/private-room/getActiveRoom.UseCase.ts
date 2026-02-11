import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class GetActiveRoomUseCase {
  constructor(private readonly roomRepo: ISocketCacheService) {}

  async execute(userId: string) {
    // 1. Check Redis for an active room ID associated with this user
    const roomId = await this.roomRepo.getUserActiveRooms(userId);
    
    if (!roomId) return null;

    // 2. Fetch the full room data (members, queue, etc.)
    const roomData = await this.roomRepo.getRoom(roomId);
    return roomData;
  }
}
