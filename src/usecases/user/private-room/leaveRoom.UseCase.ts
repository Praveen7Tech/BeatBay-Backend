import { LeaveRoomResponseDTO } from "../../../application/dto/private-room/leave-rron-response.dto";
import { ILeaveRoomUseCase } from "../../../application/interfaces/usecase/private-room/leave-room-usecase.interface";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class LeaveRoomUseCase implements ILeaveRoomUseCase {
  constructor(private readonly _socketCacheService: ISocketCacheService) {}

  async execute(userId: string, roomId: string): Promise<LeaveRoomResponseDTO> {
    const room = await this._socketCacheService.getRoom(roomId);
    if (!room) throw new Error("Room not found");

    if (room.hostId === userId) {
      await this._socketCacheService.deleteRoom(roomId);

      return {
        type: "ROOM_DELETED",
      };
    }

    await this._socketCacheService.removeMember(roomId, userId);
    const updatedRoom = await this._socketCacheService.getRoom(roomId);

    return {
      type: "MEMBER_LEFT",
      room: updatedRoom!,
    };
  }
}
