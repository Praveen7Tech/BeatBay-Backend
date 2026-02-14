import { SongData } from "../../../../domain/services/redis/jamCache.service";
import { SongQueueResponse } from "../../../dto/private-room/song-queue.dto";

export interface IAddToQueueUseCase {
  execute(roomId: string, song: SongData, userId: string): Promise<SongQueueResponse>;
}
