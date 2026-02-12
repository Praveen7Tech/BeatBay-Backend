import { IAddToQueueUseCase } from "../../../application/interfaces/usecase/private-room/addTo-queue-usecase.interface";
import { ISocketCacheService, SongData } from "../../../domain/services/redis/jamCache.service";

export class AddToQueueUseCase implements IAddToQueueUseCase {
  constructor(private readonly _socketCacheService: ISocketCacheService) {}

  async execute(roomId: string, song: SongData): Promise<void> {
    const room = await this._socketCacheService.getRoom(roomId);
    if (!room) throw new Error("Room not found");

    const updatedQueue = [...room.queue, song];
    await this._socketCacheService.updateRoomQueue(roomId, updatedQueue);
  }
}
