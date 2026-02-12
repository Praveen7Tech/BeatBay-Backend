import { LeaveRoomResponseDTO } from "../../../application/dto/private-room/leave-rron-response.dto";
import { ILeaveRoomUseCase } from "../../../application/interfaces/usecase/private-room/leave-room-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class LeaveRoomUseCase implements ILeaveRoomUseCase {
  constructor(private readonly _socketCacheService: ISocketCacheService) {}

  async execute(userId: string, roomId: string): Promise<LeaveRoomResponseDTO> {
    const room = await this._socketCacheService.getRoom(roomId);
    if (!room) throw new NotFoundError("Room not found");

    const hostName = room.members.find((m)=> m.id == room.hostId)?.name
    const GuestName = room.members.find((m)=> m.id === userId)?.name

    if (room.hostId === userId) {
      await this._socketCacheService.deleteRoom(roomId);

      return {
        type: "ROOM_DELETED",
        message: `${hostName} ended this room!`
      };
    }

    await this._socketCacheService.removeMember(roomId, userId);
    const updatedRoom = await this._socketCacheService.getRoom(roomId);

    return {
      type: "MEMBER_LEFT",
      room: updatedRoom!,
      message: `${GuestName} left from the room!`
    };
  }
}
