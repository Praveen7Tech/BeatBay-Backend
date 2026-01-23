import { FriendStatusQueryResult, GlobalStatusResponse, ISocketCacheService, RedisPipeLineResult, RoomData, RoomMember, SetData, SongData } from "../../../domain/services/redis/jamCache.service";
import { getRedisClient } from "../../config/redis";
import logger from "../../utils/logger/logger";

export class SocketCacheService implements ISocketCacheService{
    private client = getRedisClient()

    // key creation logic
    private roomKey = (roomId:string) => `room_:${roomId}`
    private getMemberKey = (roomId: string) => `room_${roomId}_member`
    private getUserPointer = (userId:string) => `user_active_room_:${userId}`
    private getInviteKey= (userId: string)=> `pending_invite_:${userId}`
    private pendingGuestKey=(roomId:string) => `room_:${roomId}_pending_guest`

    // create initial room for host
    async createRoom(roomId: string, hostId: string, hostData: RoomMember): Promise<void> {
        const key = this.roomKey(roomId)
        await this.client.hSet(key, {hostId, status: "jamming", createdAt:Date.now().toString()})
        await this.client.expire(key, 86400) //24h
        await this.addMembersToRoom(roomId, hostData)
        logger.info(`room created: ${key}`)
    }

    // add guest to room while accepting invite
    async addMembersToRoom(roomId: string, member: RoomMember): Promise<void> {
        const key = this.getMemberKey(roomId)
        await this.client.hSet(key, member.id, JSON.stringify(member))
        await this.client.expire(key,86400)
        
    }

    // updated room data
    async getRoom(roomId: string): Promise<RoomData | null> {
        const roomkey = this.roomKey(roomId)
        const roomData = await this.client.hGetAll(roomkey)
        
        if(Object.keys(roomData).length == 0) return null;

        const memberKey = this.getMemberKey(roomId)
        const membersData = await this.client.hGetAll(memberKey)
        const members = Object.values(membersData).map(m=> JSON.parse(m))

        const pendingGuests = await this.client.sMembers(this.pendingGuestKey(roomId))

        return {
            roomId,
            hostId: roomData.hostId,
            members: members,
            status: roomData.status as "jamming",
            pendingGuests: pendingGuests,
            songData: roomData.songData ? JSON.parse(roomData.songData) : null,
            queue: roomData.queue ? JSON.parse(roomData.queue) : []
        }
    }

    // set temporary invite only presist 10 minut
    async setInvite(userId: string, data: SetData, ttl: number): Promise<void> {
        const key = this.getInviteKey(userId)
        await this.client.set(key, JSON.stringify(data), {EX: ttl})
    }

    // get temporary invites for user UI interface
    async getInvite(userId: string): Promise<SetData | null> {
        const key = this.getInviteKey(userId)
        const data = await this.client.get(key)
        return data ? JSON.parse(data) : null
    }

    
    // delete invite (reject invite - user)
    async deleteInvite(userId: string): Promise<void> {
        const key = this.getInviteKey(userId)
        await this.client.del(key)
    }

    // set user actived room history for presistance
    async setUserActiveRoom(userId: string, roomId: string): Promise<void> {
        const key = this.getUserPointer(userId)
        
        await this.client.set(key, roomId, {EX:86400})

        logger.info(`set user active room: ${key}`)
    }

    // get user actived room history
    async getUserActiveRooms(userId: string): Promise<string | null> {
        
        const key = this.getUserPointer(userId)
        const room = await this.client.get(key)
        
        return room
    }

    // delete room when host left
    async deleteRoom(roomId: string): Promise<void> {
        const room = await this.getRoom(roomId);
        if (!room) return;

        const pipeline = this.client.multi();

        // delete active room pointers for all actual members
        for (const member of room.members) {
            pipeline.del(this.getUserPointer(member.id));
        }

        //  Delete the individual invite notifications for all PENDING guests
        // This prevents gurst from seeing an old invite after Host left
        if (room.pendingGuests && room.pendingGuests.length > 0) {
            for (const guestId of room.pendingGuests) {
                pipeline.del(this.getInviteKey(guestId));
            }
        }

        // delete all room-specific metadata keys
        pipeline.del(this.roomKey(roomId));
        pipeline.del(this.getMemberKey(roomId));
        pipeline.del(this.pendingGuestKey(roomId));

        await pipeline.exec();
        logger.info(`room ${roomId} and all pending data deleted.`);
    }

    // remove guests from room (admin- remove && user - left)
    async removeMember(roomId: string, userId: string): Promise<void> {
        const memberKey = this.getMemberKey(roomId)
        const activeMember = this.getUserPointer(userId)

        // remove member from room
        await this.client.hDel(memberKey, userId)
        // remoev member active history
        await this.client.del(activeMember)
    }

    // manage pending guest in a room
    async addPendingInviteToRoom(roomId: string, guestId: string): Promise<void> {
        const key = this.pendingGuestKey(roomId)

        await this.client.sAdd(key, guestId)
        await this.client.expire(key, 600)
    }

    // remove pending guest info after accept/reject
    async removePendingInviteFromRoom(roomId: string, guestId: string): Promise<void> {
        const key = this.pendingGuestKey(roomId)
        await this.client.sRem(key, guestId)
    }

    // get friends status globbally for mutual friends
    async getFriendsGlobalStatus(userId: string, friendIds: string[]): Promise<GlobalStatusResponse> {
        const pipeline = this.client.multi();
        const userRoomId = await this.getUserActiveRooms(userId);

        friendIds.forEach(fId => {
            pipeline.get(this.getUserPointer(fId));    // Result [0]
            pipeline.get(this.getInviteKey(userId));   // Result [1]
            if (userRoomId) {
                pipeline.sIsMember(this.pendingGuestKey(userRoomId), fId); // Result [2]
            }
        });

        const rawResults = (await pipeline.exec()) as unknown as RedisPipeLineResult[];
        const hasUserRoom = !!userRoomId;
        const step = hasUserRoom ? 3 : 2;

        const mappedResults: FriendStatusQueryResult[] = friendIds.map((fId, index) => {
            const offset = index * step;
            return {
                friendId: fId,
                inActiveRoom: !!rawResults[offset],
                inviteToMeRaw: rawResults[offset + 1] as string | null,
                // Redis sIsMember returns 1 for true, 0 for false
                isInvitedByMe: hasUserRoom ? rawResults[offset + 2] === 1 : false, 
            };
        });

        return { results: mappedResults, hasUserRoom };
    }


    async updateRoomQueue(roomId: string, queue: SongData[]): Promise<void> {
        const key = this.roomKey(roomId);
        // Serialize the array to a string for Redis Hash storage
        await this.client.hSet(key, "queue", JSON.stringify(queue));
        // Ensure the room doesn't expire while active (optional/safety)
        await this.client.expire(key, 86400); 
    }

    async updateRoomSongData(roomId: string, songData: SongData | null): Promise<void> {
        const key = this.roomKey(roomId);

        if (!songData) {
            await this.client.hDel(key, "songData");
        } else {
            await this.client.hSet(key, "songData", JSON.stringify(songData));
        }

        await this.client.expire(key, 86400);
    }

    
}