import { RemoveFromQuueResponse } from "../../../dto/private-room/song-queue.dto";

export interface IRemoveFromQueueUseCase {
  execute(roomId: string, songId: string, userId: string): Promise<RemoveFromQuueResponse>;
}
