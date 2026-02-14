import { SongQueueResponse } from "../../../application/dto/private-room/song-queue.dto";
import { IAddToQueueUseCase } from "../../../application/interfaces/usecase/private-room/addTo-queue-usecase.interface";
import { ISocketCacheService, SongData } from "../../../domain/services/redis/jamCache.service";

export class AddToQueueUseCase implements IAddToQueueUseCase {
  constructor(private readonly _socketCacheService: ISocketCacheService) {}

  async execute(roomId: string, song: SongData, userId: string): Promise<SongQueueResponse> {
    const room = await this._socketCacheService.getRoom(roomId);
    if (!room) throw new Error("Room not found");

    const member = room.members.find(m=> m.id === userId)
    const adderName =member ? member?.name : "Guest"

    const updatedQueue = [...room.queue, song];
    const message  = `${adderName} added ${song.title} to the queue`
    await this._socketCacheService.updateRoomQueue(roomId, updatedQueue);

    return {
      message,senderName: adderName
    }
  }
}
