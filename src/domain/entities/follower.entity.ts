
export type FollowTargetType = "User" | "Artist";

export interface Follower{
    id:string;
    followId:string;
    targetId:string;
    targetType: FollowTargetType;
    createdAt: Date
}