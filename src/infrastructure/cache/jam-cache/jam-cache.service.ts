import { ISocketCacheService, RoomData, RoomMember } from "../../../domain/services/redis/jamCache.service";
import { getRedisClient } from "../../config/redis";

export class SocketCacheService implements ISocketCacheService{
    private client = getRedisClient()

    // key creation
    private roomKey = (roomId:string) => `room_:${roomId}`
    private getMemberKey = (roomId: string) => `room_${roomId}_menber`
    private getUserPointer = (userId:string) => `user_active_room_:${userId}`
    private getInviteKey= (userId: string)=> `pending_invite_:${userId}`

    async createRoom(roomId: string, hostId: string, hostData: RoomMember): Promise<void> {
        const key = this.roomKey(roomId)
        await this.client.hSet(key, {hostId, status: "jamming", createdAt:Date.now().toString()})
        await this.client.expire(key, 86400) //24h
        await this.addMembersToRoom(roomId, hostData)
    }

    async addMembersToRoom(roomId: string, member: RoomMember): Promise<void> {
        const key = this.getMemberKey(roomId)
        await this.client.hSet(key, member.id, JSON.stringify(member))
        await this.client.expire(key,86400)
    }

    async getRoom(roomId: string): Promise<RoomData | null> {
        const roomkey = this.roomKey(roomId)
        const roomData = await this.client.hGetAll(roomkey)
        if(!roomData) return null;

        const memberKey = this.getMemberKey(roomId)
        const membersData = await this.client.hGetAll(memberKey)
        const members = Object.values(membersData).map(m=> JSON.parse(m))

        return {
            roomId,
            hostId: roomData.hostId,
            members: members,
            status: roomData.status as "jamming"
        }
    }

    // set temporary invite only presist 10 minut
    async setInvite(userId: string, data: any, ttl: number): Promise<void> {
        const key = this.getInviteKey(userId)
        await this.client.set(key, JSON.stringify(data), {EX: ttl})
    }

    // delete invite (reject invite- user)
    async deleteInvite(userId: string): Promise<void> {
        const key = this.getInviteKey(userId)
        await this.client.del(key)
    }

    async setUserActiveRoom(userId: string, roomId: string): Promise<void> {
        const key = this.getUserPointer(userId)
        await this.client.set(key, roomId, {EX:86400})
    }

    async getUserActiveRooms(userId: string): Promise<string | null> {
        const key = this.getUserPointer(userId)
        return await this.client.get(key)
    }

    async deleteRoom(roomId: string): Promise<void> {
        const room = await this.getRoom(roomId)
        if(room){
            for(let member of room.members){
                // delete every users active room history when deleting
                const key = this.getUserPointer(member.id)
                await this.client.del(key)
            }
        }

        const roomKey = this.roomKey(roomId)
        const memberKey = this.getMemberKey(roomId)
        // delete room and 
        await this.client.del(roomKey)
        await this.client.del(memberKey)
    }

    async removeMember(roomId: string, userId: string): Promise<void> {
        const memberKey = this.getMemberKey(roomId)
        const activeMember = this.getUserPointer(userId)

        // remove member from room
        await this.client.hDel(memberKey, userId)
        // remoev member active history
        await this.client.del(activeMember)
    }
}