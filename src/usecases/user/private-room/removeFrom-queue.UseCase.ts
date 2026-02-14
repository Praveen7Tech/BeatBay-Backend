import { RemoveFromQuueResponse } from "../../../application/dto/private-room/song-queue.dto";
import { IRemoveFromQueueUseCase } from "../../../application/interfaces/usecase/private-room/removeFrmon-queueu.interface";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class RemoveFromQueueUseCase implements IRemoveFromQueueUseCase {
  constructor(private readonly _socketCacheService: ISocketCacheService) {}

  async execute(roomId: string, songId: string, userId: string): Promise<RemoveFromQuueResponse> {
    const room = await this._socketCacheService.getRoom(roomId);
    if (!room) throw new Error("Room not found");

    const song = room.queue.find(s=> s.id === songId)
    const member = room.members.find(m => m.id === userId)
    const songName = song ? song.title : "A song"
    const removedPerson = member ? member.name : "A Guest"

    const updatedQueue = room.queue.filter(song => song.id !== songId);
    await this._socketCacheService.updateRoomQueue(roomId, updatedQueue);

    const message = `${songName} was removed from queue by ${removedPerson}`
   
    return {
      message,
      songName: songName
    }
  }
}
