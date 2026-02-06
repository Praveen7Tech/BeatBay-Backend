import { Server, Socket } from "socket.io"
import { ISocketCacheService, RoomMember, SongData } from "../../domain/services/redis/jamCache.service"
import logger from "../utils/logger/logger";
import { IMutualFriendsStatusUseCase } from "../../application/interfaces/usecase/mutual-friends/mutual-friends-status-usecase.interface";

export class PrivateRoomHandler {
    constructor(
        private readonly socketCacheService: ISocketCacheService,
        private readonly mutalFrindsActivityUsecase: IMutualFriendsStatusUseCase
    ) {}

     private async notifyFriendsStatusChange(io: Server, userId: string, newState: "connected" | "none") {
        try {
            // Re-using your existing logic to get mutual friends
            const friendsStatusMap = await this.mutalFrindsActivityUsecase.execute(userId);
            const friendIds = Object.keys(friendsStatusMap).filter(
                (friendId)=> friendsStatusMap[friendId] === 'none'
            )

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
          console.log(`Sending invite from ${fromUserId} to room/user: ${toUserId}`);
            io.to(toUserId).emit("invite_received", fromUserId);

            this.notifyFriendsStatusChange(io, fromUserId, "connected");
        });

        //ACCEPT INVITE 
        socket.on("accept_invite", async ({ roomId, guestData }) => {
        
            const activeRoomId = await this.socketCacheService.getUserActiveRooms(roomId)
   
          if(!activeRoomId) return;
            
            // Validate the invite actually exists or expired
            const inviteData = await this.socketCacheService.getInvite(guestData.id);
         
            if (!inviteData || inviteData.roomId !== activeRoomId) {
                logger.info(`invite expired trigger ${inviteData}`)
                io.to(guestData.id).emit("invite_expired",{
                    message: "Invitation expired.!",
                    friendId: activeRoomId
                })

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

                socket.emit("room_deleted")
                this.notifyFriendsStatusChange(io, userId, "none");
            }

            socket.leave(roomId);
            socket.join(userId);
            
            const friendsStatusMap = await this.mutalFrindsActivityUsecase.execute(userId)
            socket.emit("sync_friends_status", friendsStatusMap)
        });

        // REMOVE USER FROM ROOM
        socket.on("remove_user", async({userId, roomId})=>{
            console.log("remove - ", userId, roomId)
            const room = await this.socketCacheService.getRoom(roomId);
            if (!room) return;

            await this.socketCacheService.removeMember(roomId,userId)
            const updatedRoom = await this.socketCacheService.getRoom(roomId);

            io.to(roomId).emit("room_members_updated","remove", updatedRoom, userId);
            const friendsStatusMap = await this.mutalFrindsActivityUsecase.execute(userId)
            socket.emit("sync_friends_status", friendsStatusMap)
        })


        /////////////////////////////////////

        // UPDATE PLAYBACK
       socket.on("player_action", async ({ roomId, songData }) => {
            logger.info("syncing", songData)
            try {
                if (!roomId || !songData) return;

                // save current song state
                await this.socketCacheService.updateRoomSongData(roomId, songData);

                io.to(roomId).emit("player_action", songData);
            } catch (err) {
                logger.error("player_sync error", err);
            }
        });



       socket.on("addTo_queue", async ({ roomId, song }: { roomId: string, song: SongData }) => {
            try {
                console.log("queue updation start")
                const room = await this.socketCacheService.getRoom(roomId);
                if (!room) return;

                const updatedQueue = [...room.queue, song];

                await this.socketCacheService.updateRoomQueue(roomId, updatedQueue);

                io.to(roomId).emit("queue_updated", song);
                
                logger.info(`Song added to queue in room ${roomId}`);
            } catch (error) {
                logger.error("Add to queue error:", error);
            }
        });

        socket.on("removeFromQueue", async ({ roomId, songId }: { roomId: string; songId: string }) => {
            try {
                console.log("remove updation start", songId);

                const room = await this.socketCacheService.getRoom(roomId);
                if (!room || !room.queue) return;

                // Remove song by id
                const updatedQueue = room.queue.filter(
                    (song) => song.id !== songId
                );

                await this.socketCacheService.updateRoomQueue(roomId, updatedQueue);

                // Emit updated queue to everyone in room
                io.to(roomId).emit("song_removed", songId);

                logger.info(`Song removed from queue in room ${roomId}`);
            } catch (error) {
                logger.error("remove from queue error:", error);
            }
        });

        // TIME DRIFT UPDATE
        socket.on("player_tick", ({ roomId, time, isPlaying }) => {
            //console.log("drift from host", time)
            socket.to(roomId).emit("player_tick", { time, isPlaying });
        });


    }

}
