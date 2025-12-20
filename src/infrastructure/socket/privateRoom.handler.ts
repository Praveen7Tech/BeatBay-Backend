import { Server, Socket } from "socket.io"
import { ISocketCacheService, RoomData, RoomMember } from "../../domain/services/redis/jamCache.service"
import logger from "../utils/logger/logger";

export class PrivateRoomHandler {
    constructor(
        private readonly socketCacheService: ISocketCacheService
    ) {}

    privateRoom(io: Server, socket: Socket) {

        socket.on("register", (userId: string) => {
            socket.join(userId);
            (socket as any).userId = userId;
        });

        /* ---------- INVITE SEND ---------- */
        socket.on("invite_send", async ({ fromUserId, fromUserName, fromUserImage, toUserId }) => {

            const roomId = fromUserId;

            const hostData: RoomMember = {
                id: fromUserId,
                name: fromUserName,
                image: fromUserImage,
                role: "host",
            };

            const existRoom = await this.socketCacheService.getRoom(roomId);

            if (!existRoom) {
                
                await this.socketCacheService.createRoom(roomId, fromUserId, hostData);
                await this.socketCacheService.setUserActiveRoom(fromUserId, roomId);
                socket.join(roomId);
            }

            // set pending invites
            await this.socketCacheService.setInvite(toUserId,{ roomId, hostId: fromUserId }, 60);
            // add pending users queue for the room
            await this.socketCacheService.addPendingInviteToRoom(roomId, toUserId)

            io.to(toUserId).emit("invite_received", roomId);
        });

        /* ---------- ACCEPT INVITE ---------- */
        socket.on("accept_invite", async ({ roomId, guestData }) => {

            // Validate the invite actually exists or expired
            const inviteData = await this.socketCacheService.getInvite(guestData.id);
            if (!inviteData || inviteData.roomId !== roomId) {
                logger.info(`invite expired trigger ${inviteData}`)
                io.to(guestData.id).emit("invite_expired",{
                    message: "Invitation expired.!",
                    friendId: roomId
                }),
                io.to(roomId).emit("invite_expired_host", {
                    guestId: guestData.id 
                });

                return;
            }

            const memberData: RoomMember = {
                ...guestData,
                role: "guest",
            };

            await this.socketCacheService.addMembersToRoom(roomId, memberData);
            await this.socketCacheService.setUserActiveRoom(memberData.id, roomId);

            // remoev pending stageof guest after accept
            await this.socketCacheService.deleteInvite(memberData.id);
            await this.socketCacheService.removePendingInviteFromRoom(roomId, memberData.id)

            socket.join(roomId);

            const updatedRoom = await this.socketCacheService.getRoom(roomId);
            io.to(roomId).emit("room_members_updated", updatedRoom);
        });

        /* ---------- REJECT INVITE ---------- */
        socket.on("reject_invite", async ({ hostId, guestId }) => {
            await this.socketCacheService.deleteInvite(guestId);
            await this.socketCacheService.removePendingInviteFromRoom(hostId, guestId)
            io.to(hostId).emit("invite_rejected", { guestId });
        });

        /* ---------- LEAVE ROOM ---------- */
        socket.on("left_room", async ({ userId, roomId }) => {

            const room = await this.socketCacheService.getRoom(roomId);
            if (!room) return;

            if (room.hostId === userId) {
                await this.socketCacheService.deleteRoom(roomId);
                io.to(roomId).emit("room_deleted");
            } else {
                await this.socketCacheService.removeMember(roomId, userId);
                const updatedRoom = await this.socketCacheService.getRoom(roomId);
                io.to(roomId).emit("room_members_updated", updatedRoom);
            }

            socket.leave(roomId);
        });

    }

}
