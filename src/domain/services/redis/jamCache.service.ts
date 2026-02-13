
export interface RoomMember{
    id:string
    name:string
    image: string
    role: "host" | "guest"
}

export interface SongData{
    id:string
    title:string
    image: string
    audioUrl: string
    isPlaying: boolean
    artist: string
    timestamp: number
    updatedAt: number
}

export interface RoomData{
    roomId: string
    hostId: string
    status: "pending" | "jamming"
    members: RoomMember[],
    songData: SongData
    pendingGuests: string[],
    queue: SongData[]
}

export interface SetData{
    roomId:string
    hostId:string
}

export type RedisPipeLineResult = (string|number|boolean|null)

export interface FriendsGlobalStatus{
    results: RedisPipeLineResult[]
    hasUserRoom: boolean
}

export type FriendActivityStatus = "connected" | "recieved" | "pending" | "none" | "offline";

export interface FriendStatusQueryResult {
    friendId: string;
    isOnline: boolean
    inActiveRoom: boolean;
    inviteToMeRaw: string | null;
    isInvitedByMe: boolean;
}

export interface GlobalStatusResponse {
    results: FriendStatusQueryResult[];
    hasUserRoom: boolean;
}


export interface ISocketCacheService{
    createRoom(roomId: string, hostId: string, hostData:RoomMember): Promise<void>
    addMembersToRoom(roomId: string, member: RoomMember): Promise<void>
    getRoom(roomId:string): Promise<RoomData | null>

    setInvite(userId: string, data: SetData, ttl: number): Promise<void>
    getInvite(userId: string): Promise<SetData | null>
    deleteInvite(userId: string): Promise<void>

    setUserActiveRoom(userId: string, roomId: string): Promise<void>
    getUserActiveRooms(userId: string): Promise<string | null>

    addPendingInviteToRoom(roomId: string, guestId: string): Promise<void>
    removePendingInviteFromRoom(roomId: string, guestId: string): Promise<void>

    deleteRoom(roomId: string): Promise<void>

    removeMember(roomId: string, userId: string): Promise<void>

    getFriendsGlobalStatus(userId: string, friendIds: string[]): Promise<GlobalStatusResponse>;


    updateRoomQueue(roomId: string, queue: SongData[]): Promise<void>;
    updateRoomSongData(roomId: string, songData: SongData | null): Promise<void>;

    setUserOnline(userId:string): Promise<void>
    setUserOffline(userId:string): Promise<void>
    getOnlineFriends(friendsIds: string[]): Promise<string[]>

}