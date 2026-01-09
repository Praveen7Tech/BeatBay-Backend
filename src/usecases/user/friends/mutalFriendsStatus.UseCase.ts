import { IMutualFriendsStatusUseCase } from "../../../application/interfaces/usecase/mutual-friends/mutual-friends-status-usecase.interface";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class MutualFriendsStatusUseCase implements IMutualFriendsStatusUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _cacheRoomService: ISocketCacheService
    ){}

    async execute(userId: string): Promise<Record<string, string>> {
        const inviteStatusMap: Record<string, string> = {};
        
        const friends = await this._userRepository.getMutualFriends(userId);
        if (!friends || friends.length === 0) return {};

        const friendIds = friends.map(f => f._id.toString());

        const { results, hasUserRoom } = await this._cacheRoomService.getFriendsGlobalStatus(userId, friendIds);

        const step = hasUserRoom ? 3 : 2;

        friends.forEach((friend, index) => {
            const friendId = friend._id.toString();
            const offset = index * step;

            const activeRoomId = results[offset];
            const inviteToMeRaw = results[offset + 1];
            const isInvitedByMe = hasUserRoom ? results[offset + 2] : false;

            const inviteToMe = inviteToMeRaw ? JSON.parse(inviteToMeRaw as string) : null;

            if (activeRoomId && !inviteToMe ) {
                inviteStatusMap[friendId] = "connected";
            } else if (inviteToMe && inviteToMe.hostId === friendId) {
                inviteStatusMap[friendId] = "recieved";
            } else if (isInvitedByMe) {
                inviteStatusMap[friendId] = "pending";
            } else {
                inviteStatusMap[friendId] = "none";
            }
        });

        return inviteStatusMap;
    }
}