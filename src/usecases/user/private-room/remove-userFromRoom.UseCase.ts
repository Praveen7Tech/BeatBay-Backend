import { IRemoveUserUseCase, RemoveUserResponse } from "../../../application/interfaces/usecase/private-room/remove-user-from-room-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class RemoveUserUseCase implements IRemoveUserUseCase {
    constructor(
        private readonly _socketCacheService: ISocketCacheService
    ) {}

    async execute(userId: string, roomId: string):Promise<RemoveUserResponse> {

        const room = await this._socketCacheService.getRoom(roomId);
        if (!room) throw new NotFoundError("Room not found");

        const hostName = room.members.find((m)=> m.id === room.hostId)?.name
        const removedUser = room.members.find((m)=> m.id === userId)

        if (!removedUser) throw new NotFoundError("Member not found in room")
        
        await this._socketCacheService.removeMember(roomId, userId);
        const updatedRoom = await this._socketCacheService.getRoom(roomId);
        if(!updatedRoom) throw new NotFoundError("Room not found after member removal")
        
        const message = `${hostName || "Host"} removed ${removedUser.name} from the room!`    

        return {updatedRoom, message}
    }
}
