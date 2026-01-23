
export type FollowTargetType = "User" | "Artist";

export interface Follower{
    id:string;
    followId:string;
    targetId:string;
    targetType: FollowTargetType;
    createdAt: Date
}

export interface FollowerUser{
    _id:string
    name: string
    role: string
    profilePicture: string
    createdAt: string
}

export type FollowerWithUser = Omit<Follower, "followId">&{
    followerId: FollowerUser
}