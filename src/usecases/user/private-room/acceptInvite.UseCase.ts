import { ISocketCacheService, RoomMember } from "../../../domain/services/redis/jamCache.service";

export class AcceptInviteUseCase {
  constructor(private readonly socketCacheService: ISocketCacheService) {}

  async execute(roomId: string, guestData:  Omit<RoomMember, "role">) {
    
    const activeRoomId = await this.socketCacheService.getUserActiveRooms(roomId);
    if (!activeRoomId) throw new Error("Room not found");

    const invite = await this.socketCacheService.getInvite(guestData.id);
    if (!invite || invite.roomId !== activeRoomId) {
      throw new Error("Invite expired");
    }

    const member: RoomMember = {
      ...guestData,
      role: "guest",
    };

    await this.socketCacheService.addMembersToRoom(roomId, member);

    await this.socketCacheService.setUserActiveRoom(guestData.id, activeRoomId);
    await this.socketCacheService.deleteInvite(guestData.id);
    await this.socketCacheService.removePendingInviteFromRoom(activeRoomId, guestData.id);

    return await this.socketCacheService.getRoom(activeRoomId);
  }
}
