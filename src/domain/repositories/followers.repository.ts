import { FollowerPreview } from "../interfaces/following";

export interface IFollowersRepository{
    getFollowersList(targetId: string, page: number, limit: number): Promise<{ followers: FollowerPreview[], total: number }>
    getFollowersIdsStream(targetId: string): AsyncIterable<{ followerId: string }>;
}