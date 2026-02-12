import { IRemoveUserUseCase } from "../../../application/interfaces/usecase/private-room/remove-user-from-room-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { ISocketCacheService, RoomData } from "../../../domain/services/redis/jamCache.service";

export class RemoveUserUseCase implements IRemoveUserUseCase {
    constructor(
        private readonly _socketCacheService: ISocketCacheService
    ) {}

    async execute(userId: string, roomId: string):Promise<RoomData> {

        await this._socketCacheService.removeMember(roomId, userId);
        const updatedRoom = await this._socketCacheService.getRoom(roomId);
        if(!updatedRoom) throw new NotFoundError("Room not found after member removal")

        return updatedRoom
    }
}
