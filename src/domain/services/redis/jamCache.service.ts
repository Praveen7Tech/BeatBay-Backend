
export interface RoomData{
    roomId: string
    hostId: string
    guestId: string
    status: "pending" | "jamming"
}


export interface ISocketCacheService{
    setRoom(key: string, value: RoomData, ttl: number): Promise<void>
    getRoom(key: string): Promise<RoomData | null>
    deleteRoom(key: string): Promise<void>
}