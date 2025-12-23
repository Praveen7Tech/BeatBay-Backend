
export interface RoomMember{
    id:string
    name:string
    image: string
    role: "host" | "guest"
}

export interface RoomData{
    roomId: string
    hostId: string
    status: "pending" | "jamming"
    members: RoomMember[],
    pendingGuests: string[]
}


export interface ISocketCacheService{
    createRoom(roomId: string, hostId: string, hostData:RoomMember): Promise<void>
    addMembersToRoom(roomId: string, member: RoomMember): Promise<void>
    getRoom(roomId:string): Promise<RoomData | null>

    setInvite(userId: string, data: any, ttl: number): Promise<void>
    getInvite(userId: string): Promise<any | null>
    deleteInvite(userId: string): Promise<void>

    setUserActiveRoom(userId: string, roomId: string): Promise<void>
    getUserActiveRooms(userId: string): Promise<string | null>

    addPendingInviteToRoom(roomId: string, guestId: string): Promise<void>
    removePendingInviteFromRoom(roomId: string, guestId: string): Promise<void>

    deleteRoom(roomId: string): Promise<void>

    removeMember(roomId: string, userId: string): Promise<void>

    getFriendsGlobalStatus(userId: string, friendIds: string[]): Promise<Record<string, any>>;
}