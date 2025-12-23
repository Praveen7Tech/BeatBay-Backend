import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class MutualFrindsStatus{
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _cacheRoomService: ISocketCacheService
    ){}

    async execute(userId: string) {
        const inviteStatusMap: Record<string, string> = {};
        const friends = await this._userRepository.getMutualFriends(userId);
        const friendIds = friends.map(f => f._id.toString());

        const { results, hasUserRoom } = await this._cacheRoomService.getFriendsGlobalStatus(userId, friendIds);

        // Number of commands sent per friend in the pipeline
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
                // Friend sent invite to ME
                inviteStatusMap[friendId] = "recieved";
            } else if (isInvitedByMe) {
                // I sent invite to FRIEND
                inviteStatusMap[friendId] = "pending";
            } else {
                inviteStatusMap[friendId] = "none";
            }
        });

        return inviteStatusMap;
    }
}