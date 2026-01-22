export interface FollowedEntity {
    _id: string
    name: string;
    role: 'user' | 'artist' ;
    profilePicture?: string;
}

export interface FollowingData {
    artists: FollowedEntity[];
    users: FollowedEntity[];
}

export interface FollowerPreview{
    id:string,
    name:string;
    role:string;
    profilePicture:string
    createdAt: string
}