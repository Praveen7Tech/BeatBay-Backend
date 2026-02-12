import { SongData } from "../../../../domain/services/redis/jamCache.service";

export interface IPlayerActionUseCase {
  execute(roomId: string, song: SongData): Promise<void>;
}
