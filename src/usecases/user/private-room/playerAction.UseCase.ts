import { ISocketCacheService, SongData } from "../../../domain/services/redis/jamCache.service";

export class PlayerActionUseCase {
  constructor(private readonly socketCacheService: ISocketCacheService) {}

  async execute(roomId: string, song: SongData) {
    await this.socketCacheService.updateRoomSongData(roomId, song);
  }
}
