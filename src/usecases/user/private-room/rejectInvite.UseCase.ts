import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class RejectInviteUseCase {
  constructor(private readonly socketCacheService: ISocketCacheService) {}

  async execute(hostId: string, guestId: string) {
    await this.socketCacheService.deleteInvite(guestId);
    await this.socketCacheService.removePendingInviteFromRoom(hostId, guestId);
  }
}
