import { FollowersResponseDTO } from "../../../dto/follow/following.dto";

export interface IGetProfileFollowersPreviewUseCase {
    execute(userId: string, page: number, limit: number): Promise<FollowersResponseDTO>;
}