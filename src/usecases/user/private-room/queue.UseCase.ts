import { ISocketCacheService, SongData } from "../../../domain/services/redis/jamCache.service";

export class QueueUseCase {
  constructor(private readonly socketCacheService: ISocketCacheService) {}

  async add(roomId: string, song: SongData) {
    const room = await this.socketCacheService.getRoom(roomId);
    const updated = [...room!.queue, song];
    await this.socketCacheService.updateRoomQueue(roomId, updated);
  }

  async remove(roomId: string, songId: string) {
    const room = await this.socketCacheService.getRoom(roomId);
    const updated = room!.queue.filter(s => s.id !== songId);
    await this.socketCacheService.updateRoomQueue(roomId, updated);
  }
}
