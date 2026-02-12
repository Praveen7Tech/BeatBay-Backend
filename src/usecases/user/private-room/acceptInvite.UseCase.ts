import { IAcceptInviteUseCase } from "../../../application/interfaces/usecase/private-room/accept-invite-usecase.interface";
import { ExpiredError, NotFoundError } from "../../../common/errors/common/common.errors";
import { ISocketCacheService, RoomData, RoomMember } from "../../../domain/services/redis/jamCache.service";

export class AcceptInviteUseCase implements IAcceptInviteUseCase {
  constructor(
    private readonly _socketCacheService: ISocketCacheService
  ) {}

  async execute(roomId: string,guestData: Omit<RoomMember, "role">): Promise<RoomData> {

    const activeRoomId = await this._socketCacheService.getUserActiveRooms(roomId);

    if (!activeRoomId) throw new NotFoundError("Room not found");

    const invite = await this._socketCacheService.getInvite(guestData.id);

    if (!invite || invite.roomId !== activeRoomId) {
      throw new ExpiredError("Invite expired");
    }

    const member: RoomMember = {
      ...guestData,
      role: "guest",
    };

    await this._socketCacheService.addMembersToRoom(activeRoomId, member);
    await this._socketCacheService.setUserActiveRoom(guestData.id, activeRoomId);
    await this._socketCacheService.deleteInvite(guestData.id);
    await this._socketCacheService.removePendingInviteFromRoom(activeRoomId,guestData.id);

    const room = await this._socketCacheService.getRoom(activeRoomId);

    if (!room) throw new Error("Room corrupted"); 

    return room;
  }
}
