import { Server, Socket } from "socket.io"
import { ISocketCacheService, RoomData } from "../../domain/services/redis/jamCache.service"
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

        // preistence check
        socket.on("presistence", async(userId)=>{
            logger.info(`presistence check : ${userId}`)
            await this.socketCacheService.getRoom(userId)
        })

        // Invite
        socket.on("invite_send", async ({ fromUserId, toUserId }) => {
            logger.info(`invite sended from :${fromUserId}, to : ${toUserId}`)
            const data: RoomData = {
                roomId: "",
                hostId: fromUserId,
                guestId: toUserId,
                status: "pending",
            }

            await this.socketCacheService.setRoom(fromUserId, data, 3600)
            await this.socketCacheService.setRoom(toUserId, data, 3600)

            io.to(toUserId).emit("invite_received", { fromUserId })
        })

        // Accept invite
        socket.on("accept_invite", async ({ hostId, guestId }) => {
            logger.info(`invite accepted from: ${guestId}, from : ${hostId}`)
            const roomId = `room:${hostId}_${guestId}`

            const room: RoomData = {
                roomId,
                hostId,
                guestId,
                status: "jamming",
            }

            await this.socketCacheService.setRoom(hostId, room, 360)
            await this.socketCacheService.setRoom(guestId, room, 360)

            io.to(hostId).socketsJoin(roomId)
            io.to(guestId).socketsJoin(roomId)

            io.to(roomId).emit("room_created", room)
        })

        // reject Invite
        socket.on("reject_invite", async({hostId, guestId})=>{
            logger.info(`reject invite from: ${guestId} of : ${hostId}`)

            await this.socketCacheService.deleteRoom(guestId)

            io.to(hostId).emit("invite_rejected", {guestId})
        })

        // left from room
        socket.on("left_room", async ({ userId, roomId }) => {
        logger.info(`User: ${userId} leaving room: ${roomId}`);

        const roomData = await this.socketCacheService.getRoom(userId);
        
        if (roomData) {
            await this.socketCacheService.deleteRoom(roomData.hostId);
            await this.socketCacheService.deleteRoom(roomData.guestId);

            const payload = { hostId: roomData.hostId, guestId: roomData.guestId };
            
            io.to(roomData.hostId).emit("room_cancelled", payload);
            io.to(roomData.guestId).emit("room_cancelled", payload);

            const sockets = await io.in(roomId).fetchSockets();
            sockets.forEach(s => s.leave(roomId));
        }
    });
    }
}
