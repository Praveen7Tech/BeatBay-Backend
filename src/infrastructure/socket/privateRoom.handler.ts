import { Server, Socket } from "socket.io"
import { ISocketCacheService, RoomData, RoomMember } from "../../domain/services/redis/jamCache.service"
import logger from "../utils/logger/logger";
import { MutualFrindsStatus } from "../../usecases/user/friends/mutalFriendsStatus.UseCase";

export class PrivateRoomHandler {
    constructor(
        private readonly socketCacheService: ISocketCacheService,
        private readonly mutalFrindsActivityUsecase: MutualFrindsStatus
    ) {}

     private async notifyFriendsStatusChange(io: Server, userId: string, newState: "connected" | "none") {
        try {
            // Re-using your existing logic to get mutual friends
            const friendsStatusMap = await this.mutalFrindsActivityUsecase.execute(userId);
            const friendIds = Object.keys(friendsStatusMap);

            friendIds.forEach(friendId => {
                io.to(friendId).emit("friend_status_changed", {
                    friendId: userId, 
                    status: newState
                });
            });
        } catch (error) {
            logger.error("Error in notifyFriendsStatusChange:", error);
        }
    }

    privateRoom(io: Server, socket: Socket) {

        // initial socket registration and hydration check
        socket.on("register", async(userId: string) => {
            socket.join(userId);
            
            const roomId = await this.socketCacheService.getUserActiveRooms(userId)
            if(roomId){
                socket.join(roomId)

                const roomData = await this.socketCacheService.getRoom(roomId)
                
                socket.emit("restore_room_state", roomData)
            }

            const friendsStatusMap = await this.mutalFrindsActivityUsecase.execute(userId)
            console.log("romm restore--", friendsStatusMap)
            socket.emit("sync_friends_status", friendsStatusMap)
        });

        // INVITE SEND 
        socket.on("invite_send", async ({ fromUserId, fromUserName, fromUserImage, toUserId }) => {

           // manage the invite from guest to guest (not host)
            const userActiveRoom = await this.socketCacheService.getUserActiveRooms(fromUserId)
            const roomId = userActiveRoom || fromUserId;
           
            let existRoom = await this.socketCacheService.getRoom(roomId);

            if (!existRoom) {
                const hostData: RoomMember = {
                    id: fromUserId,
                    name: fromUserName,
                    image: fromUserImage,
                    role: "host",
                };
                
                await this.socketCacheService.createRoom(roomId, fromUserId, hostData);
                await this.socketCacheService.setUserActiveRoom(fromUserId, roomId);
                socket.join(roomId);

                existRoom = await this.socketCacheService.getRoom(roomId)
            }

            // set pending invites
            await this.socketCacheService.setInvite(toUserId,{ roomId, hostId: existRoom?.hostId }, 600);
            // add pending users queue for the room
            await this.socketCacheService.addPendingInviteToRoom(roomId, toUserId)

            io.to(fromUserId).emit("room_created", existRoom)
            io.to(toUserId).emit("invite_received", {fromUserId , roomId});

           // this.notifyFriendsStatusChange(io, toUserId, "connected");
        });

        //ACCEPT INVITE 
        socket.on("accept_invite", async ({ roomId, guestData }) => {
            
            const userActiveRoom = await this.socketCacheService.getUserActiveRooms(roomId)
            const activeRoomId = userActiveRoom || roomId
            
            // Validate the invite actually exists or expired
            const inviteData = await this.socketCacheService.getInvite(guestData.id);
            
            if (!inviteData || inviteData.roomId !== activeRoomId) {
                logger.info(`invite expired trigger ${inviteData}`)
                io.to(guestData.id).emit("invite_expired",{
                    message: "Invitation expired.!",
                    friendId: activeRoomId
                })
                // io.to(roomId).emit("invite_expired_host", {
                //     guestId: guestData.id 
                // });

                return;
            }

            const memberData: RoomMember = {
                ...guestData,
                role: "guest",
            };

            await this.socketCacheService.addMembersToRoom(activeRoomId, memberData);
            await this.socketCacheService.setUserActiveRoom(memberData.id, activeRoomId);

            // remoev pending stageof guest after accept
            await this.socketCacheService.deleteInvite(memberData.id);
            await this.socketCacheService.removePendingInviteFromRoom(activeRoomId, memberData.id)

            socket.join(activeRoomId);

            const updatedRoom = await this.socketCacheService.getRoom(activeRoomId);
            io.to(activeRoomId).emit("room_members_updated","join", updatedRoom);

            this.notifyFriendsStatusChange(io, guestData.id, "connected");
        });

        // REJECT INVITE 
        socket.on("reject_invite", async ({ hostId, guestId }) => {
            await this.socketCacheService.deleteInvite(guestId);
            await this.socketCacheService.removePendingInviteFromRoom(hostId, guestId)
            io.to(hostId).emit("invite_rejected", { guestId });
        });

        // LEAVE ROOM
        socket.on("left_room", async ({ userId, roomId }) => {

            const room = await this.socketCacheService.getRoom(roomId);
            if (!room) return;

            if (room.hostId === userId) {
                await this.socketCacheService.deleteRoom(roomId);
                io.to(roomId).emit("room_deleted");

                this.notifyFriendsStatusChange(io, userId, "none");
            } else {
                await this.socketCacheService.removeMember(roomId, userId);
                const updatedRoom = await this.socketCacheService.getRoom(roomId);
                const type ="left"
                io.to(roomId).emit("room_members_updated",type, updatedRoom, userId);

                socket.emit("user_left")
                this.notifyFriendsStatusChange(io, userId, "none");
            }

            socket.leave(roomId);
            const friendsStatusMap = await this.mutalFrindsActivityUsecase.execute(userId)
            socket.emit("sync_friends_status", friendsStatusMap)
        });

    }

}
