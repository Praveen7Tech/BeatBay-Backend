
export interface FriendsResponse{
    id: string;
    name: string
    profilePicture:string
    status: boolean
}

export interface FriendsResponseDTO{
    friends: FriendsResponse[]
}