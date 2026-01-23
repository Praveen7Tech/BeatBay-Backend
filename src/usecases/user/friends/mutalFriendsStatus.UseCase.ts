import { IMutualFriendsStatusUseCase } from "../../../application/interfaces/usecase/mutual-friends/mutual-friends-status-usecase.interface";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { FriendActivityStatus, ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class MutualFriendsStatusUseCase implements IMutualFriendsStatusUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _cacheRoomService: ISocketCacheService
    ) {}

    async execute(userId: string): Promise<Record<string, FriendActivityStatus>> {
        const inviteStatusMap: Record<string, FriendActivityStatus> = {};
        
        const friends = await this._userRepository.getMutualFriends(userId);
        if (!friends?.length) return {};

        const friendIds = friends.map(f => f._id.toString());
        const { results } = await this._cacheRoomService.getFriendsGlobalStatus(userId, friendIds);

        results.forEach((res) => {
            const inviteToMe = res.inviteToMeRaw ? JSON.parse(res.inviteToMeRaw) : null;

            if (res.inActiveRoom && !inviteToMe) {
                inviteStatusMap[res.friendId] = "connected";
            } else if (inviteToMe && inviteToMe.hostId === res.friendId) {
                inviteStatusMap[res.friendId] = "received";
            } else if (res.isInvitedByMe) {
                inviteStatusMap[res.friendId] = "pending";
            } else {
                inviteStatusMap[res.friendId] = "none";
            }
        });

        return inviteStatusMap;
    }
}
