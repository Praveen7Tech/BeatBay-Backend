import { IRemoveFromQueueUseCase } from "../../../application/interfaces/usecase/private-room/removeFrmon-queueu.interface";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class RemoveFromQueueUseCase implements IRemoveFromQueueUseCase {
  constructor(private readonly _socketCacheService: ISocketCacheService) {}

  async execute(roomId: string, songId: string): Promise<void> {
    const room = await this._socketCacheService.getRoom(roomId);
    if (!room) throw new Error("Room not found");

    const updatedQueue = room.queue.filter(song => song.id !== songId);
    await this._socketCacheService.updateRoomQueue(roomId, updatedQueue);
  }
}
