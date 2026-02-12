import { IPlayerActionUseCase } from "../../../application/interfaces/usecase/private-room/player-action-usecase.interface";
import { ISocketCacheService, SongData } from "../../../domain/services/redis/jamCache.service";

export class PlayerActionUseCase implements IPlayerActionUseCase {
  constructor(private readonly _socketCacheService: ISocketCacheService) {}

  async execute(roomId: string, song: SongData): Promise<void> {
    await this._socketCacheService.updateRoomSongData(roomId, song);
  }
}
