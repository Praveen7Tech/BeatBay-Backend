import { FollowersResponseDTO } from "../../../dto/follow/following.dto";

export interface IGetFollowingListUseCase {
    execute(userId: string, page: number, limit: number): Promise<FollowersResponseDTO>;
}