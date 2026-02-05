import { IFollowingHandleUseCase } from "../../../application/interfaces/usecase/following/following-handle-usecase.interface";
import { IArtistDailyAnalyticsRepository } from "../../../domain/repositories/artist.daily.analytics.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class FollowingHandleUseCase implements IFollowingHandleUseCase{
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _dailyAnalyticsRepository: IArtistDailyAnalyticsRepository
    ) {}

    async execute(followId: string, targetId: string, role: string, action: string): Promise<void> {
        const today = new Date().toISOString().split("T")[0];

        if (followId === targetId) {
            throw new Error("Cannot follow yourself.");
        }
        
        await this._userRepository.toggleFollow(followId, targetId, role, action);

        if(role === "artist"){
            await this._dailyAnalyticsRepository.incrementField(targetId,today,"fans",1)
        }
    }
}