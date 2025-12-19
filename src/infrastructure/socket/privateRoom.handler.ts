import { Server, Socket } from "socket.io"
import { ISocketCacheService, RoomData, RoomMember } from "../../domain/services/redis/jamCache.service"
import logger from "../utils/logger/logger"

export class PrivateRoomHandler {
    constructor(
        private readonly socketCacheService: ISocketCacheService
    ) {}

    privateRoom(io: Server, socket: Socket) {

        socket.on("register", (userId: string) => {
            socket.join(userId)
            logger.info(`registered socket : ${userId}`)
        })


        // Invite users to join room
        socket.on("invite_send", async ({ fromUserId,fromUserName, fromUserImage, toUserId }) => {
            logger.info(`invite sended from :${fromUserId}, to : ${toUserId}`)

            const roomId = `room:_${fromUserId}`
            const hostData:RoomMember = {
                id:fromUserId,
                name: fromUserName,
                image: fromUserImage,
                role: "host"
            }

            // checking for existing host room
            const existRoom = await this.socketCacheService.getRoom(roomId)
            if(!existRoom){
                await this.socketCacheService.createRoom(roomId,fromUserId,hostData)
                // setting useractive room history
                await this.socketCacheService.setUserActiveRoom(fromUserId, roomId)

                socket.join(roomId)
            }
            
            // create a temporary invite last only 10 minutes
            const invite = {roomId, hostId: fromUserId, hostName: fromUserName}
            await this.socketCacheService.setInvite(toUserId, invite, 600)

            // emit event to curresponding users
            io.to(toUserId).emit("invite_received", roomId)

        })

        // Accept invite
        socket.on("accept_invite", async ({ roomId, guestData}) => {
           const memberData : RoomMember = {...guestData, role :"guest"}

           await this.socketCacheService.addMembersToRoom(roomId, memberData)
           // set user active room history
           await this.socketCacheService.setUserActiveRoom(memberData.id, roomId)

           socket.join(roomId);
           // fetch updated room from cache
           const updatedRoom = await this.socketCacheService.getRoom(roomId)

           // emit event to the curresponding room
           io.to(roomId).emit("room_members_updated", updatedRoom)
        })

        //reject Invite
        socket.on("reject_invite", async({hostId})=>{
            const guestId = (socket as any).userId; // Trusted ID from auth middleware
            logger.info(`Invite rejected by Guest: ${guestId} for Host: ${hostId}`);

            await this.socketCacheService.deleteInvite(guestId);

            // 2. NOTIFY HOST: Tell the host the invite was declined
            // We send the guestId so the host knows which specific friend to reset in the UI
            io.to(hostId).emit("invite_rejected", { guestId });
            
            // Optional: You can also notify the guest themselves to confirm the action
            socket.emit("invite_status_updated", { state: "none" });
        })

        // left from room
        socket.on("left_room", async ({ userId, roomId }) => {
        logger.info(`User: ${userId} leaving room: ${roomId}`);

        const room = await this.socketCacheService.getRoom(roomId);
        
        if(room?.hostId === userId){
            // if the host left completely delete room
            await this.socketCacheService.deleteRoom(roomId)
            // emit event to room
            io.to(roomId).emit("room_deleted", {reason: "HOST_LEFT"})
        }else{
            // guest left
            await this.socketCacheService.removeMember(roomId, userId)
            const updatedRoom = await this.socketCacheService.getRoom(roomId)

            // update the room data and emit
            io.to(roomId).emit("room_member_updated", updatedRoom)
            // remove the socket connection from the room
            socket.leave(roomId)
        }
        
    });
    }
}
