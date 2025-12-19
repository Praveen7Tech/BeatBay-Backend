
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
    members: RoomMember[]
}


export interface ISocketCacheService{
    createRoom(roomId: string, hostId: string, hostData:RoomMember): Promise<void>
    addMembersToRoom(roomId: string, member: RoomMember): Promise<void>
    getRoom(roomId:string): Promise<RoomData | null>

    setInvite(userId: string, data: any, ttl: number): Promise<void>
    deleteInvite(userId: string): Promise<void>

    setUserActiveRoom(userId: string, roomId: string): Promise<void>
    getUserActiveRooms(userId: string): Promise<string | null>

    deleteRoom(roomId: string): Promise<void>

    removeMember(roomId: string, userId: string): Promise<void>
}