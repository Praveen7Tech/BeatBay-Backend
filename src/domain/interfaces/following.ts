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