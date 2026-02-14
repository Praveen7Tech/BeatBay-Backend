import { InviteUserResponseDTO } from "../../../application/dto/private-room/invite-user.response.dto";
import { InviteSendEvent } from "../../../application/dto/private-room/private.room.dto";
import { IInviteUserUseCase } from "../../../application/interfaces/usecase/private-room/invite-user-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ISocketCacheService, RoomMember } from "../../../domain/services/redis/jamCache.service";

export class InviteUserUseCase implements IInviteUserUseCase {
  constructor(
    private readonly _socketCacheService: ISocketCacheService,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(data: InviteSendEvent): Promise<InviteUserResponseDTO> {
    
    const activeRoom = await this._socketCacheService.getUserActiveRooms(data.fromUserId);
    const roomId = activeRoom || data.fromUserId;

    const sender = await this._userRepository.findById(data.fromUserId)
    if(!sender) throw new NotFoundError("sender not found!")
    let room = await this._socketCacheService.getRoom(roomId);
    if (!room) {
      const host: RoomMember = {
        id: data.fromUserId,
        name: sender.name,
        image: sender.profilePicture || "",
        role: "host",
      };

      await this._socketCacheService.createRoom(roomId, data.fromUserId, host);  
      await this._socketCacheService.setUserActiveRoom(data.fromUserId, roomId);

      room = await this._socketCacheService.getRoom(roomId);
      if (!room) {
        throw new Error("Failed to create room"); 
      }
    }

    await this._socketCacheService.setInvite(
      data.toUserId,
      { roomId, hostId: room.hostId },
      600
    );

    await this._socketCacheService.addPendingInviteToRoom(roomId, data.toUserId);

    return { room };
  }
}
