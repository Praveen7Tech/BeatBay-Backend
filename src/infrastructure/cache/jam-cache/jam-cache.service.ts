import { ISocketCacheService, RoomData } from "../../../domain/services/redis/jamCache.service";
import { getRedisClient } from "../../config/redis";

export class SocketCacheService implements ISocketCacheService{
    private client = getRedisClient()

    private getSessionkey(userId: string): string{
        return `jam_session:${userId}`
    }

    async setRoom(userId: string, value: RoomData, ttl: number): Promise<void> {
        await this.client.set(this.getSessionkey(userId), JSON.stringify(value) ,{EX: ttl})
    }

    async getRoom(userId: string): Promise<RoomData | null> {
        const room = await this.client.get(this.getSessionkey(userId))
        return room ? JSON.parse(room) : null
    }

    async deleteRoom(userId: string): Promise<void> {
        await this.client.del(this.getSessionkey(userId))
    }
}