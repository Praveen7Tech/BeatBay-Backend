
import { InviteSendEvent } from "../../../application/dto/private-room/private.room.dto";
import { ISocketCacheService, RoomMember } from "../../../domain/services/redis/jamCache.service";


export class InviteUserUseCase {
  constructor(private readonly socketCacheService: ISocketCacheService) {}

  async execute(data: InviteSendEvent) {
 
    const activeRoom = await this.socketCacheService.getUserActiveRooms(data.fromUserId);
    const roomId = activeRoom || data.fromUserId;

    let room = await this.socketCacheService.getRoom(roomId);

    if (!room) {
      const host: RoomMember = {
        id: data.fromUserId,
        name: data.fromUserName,
        image: data.fromUserImage,
        role: "host",
      };

      await this.socketCacheService.createRoom(roomId, data.fromUserId, host);
      await this.socketCacheService.setUserActiveRoom(data.fromUserId, roomId);

      room = await this.socketCacheService.getRoom(roomId);
    }

    await this.socketCacheService.setInvite(data.toUserId, { roomId, hostId: room!.hostId }, 600);
    await this.socketCacheService.addPendingInviteToRoom(roomId, data.toUserId);

    return room;
  }
}
