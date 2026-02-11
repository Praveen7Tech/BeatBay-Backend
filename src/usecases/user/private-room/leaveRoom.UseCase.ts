import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class LeaveRoomUseCase {
  constructor(private readonly socketCacheService: ISocketCacheService) {}

  async execute(userId: string, roomId: string) {
    const room = await this.socketCacheService.getRoom(roomId);
    if (!room) return null;

    if (room.hostId === userId) {
      await this.socketCacheService.deleteRoom(roomId);
      return { deleted: true };
    }

    await this.socketCacheService.removeMember(roomId, userId);
    const updated = await this.socketCacheService.getRoom(roomId);
console.log("user left")
    return { deleted: false, updated };
  }
}
