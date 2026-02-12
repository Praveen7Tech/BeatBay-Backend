import { IRejectInviteUseCase } from "../../../application/interfaces/usecase/private-room/reject-invite-usecase.interface";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class RejectInviteUseCase implements IRejectInviteUseCase {
  constructor(private readonly _socketCacheService: ISocketCacheService) {}

  async execute(hostId: string, guestId: string): Promise<void> {
    await this._socketCacheService.deleteInvite(guestId);
    await this._socketCacheService.removePendingInviteFromRoom(hostId, guestId);
  }
}
