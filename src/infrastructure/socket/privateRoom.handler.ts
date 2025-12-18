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

        // Invite
        socket.on("invite_send", async ({ fromUserId, toUserId }) => {
            logger.info(`invite sended from :${fromUserId}, to : ${toUserId}`)
            const data: RoomData = {
                roomId: "",
                hostId: fromUserId,
                guestId: toUserId,
                status: "pending",
            }

            await this.socketCacheService.setRoom(toUserId, data, 60)

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
    }
}
