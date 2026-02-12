import { SongData } from "../../../../domain/services/redis/jamCache.service";

export interface IAddToQueueUseCase {
  execute(roomId: string, song: SongData): Promise<void>;
}
