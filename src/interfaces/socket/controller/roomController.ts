
import { Server, Socket } from "socket.io";
import { InviteUserUseCase } from "../../../usecases/user/private-room/inviteUser.UseCase";
import { AcceptInviteUseCase } from "../../../usecases/user/private-room/acceptInvite.UseCase";
import { LeaveRoomUseCase } from "../../../usecases/user/private-room/leaveRoom.UseCase";
import { PlayerActionUseCase } from "../../../usecases/user/private-room/playerAction.UseCase";
import { QueueUseCase } from "../../../usecases/user/private-room/queue.UseCase";
import { RejectInviteUseCase } from "../../../usecases/user/private-room/rejectInvite.UseCase";
import { NotifyFriendsStatusUseCase } from "../../../usecases/user/private-room/notify-friends-status.UseCase";
import { IMutualFriendsStatusUseCase } from "../../../application/interfaces/usecase/mutual-friends/mutual-friends-status-usecase.interface";
import { AcceptInviteEvent, AddToQueueEvent, InviteSendEvent, LeaveRoomEvent, PlayerActionEvent, PlayerTickEvent, RejectInviteEvent, RemoveFromQueueEvent, RemoveUserEvent } from "../../../application/dto/private-room/private.room.dto";

export class RoomController {
    constructor(
        private readonly inviteUserUsecase: InviteUserUseCase,
        private readonly acceptInviteUsecase: AcceptInviteUseCase,
        private readonly rejectInviteUsecase: RejectInviteUseCase,
        private readonly leaveRoomUsecase: LeaveRoomUseCase,
        private readonly playerActionUsecase: PlayerActionUseCase,
        private readonly queueUsecase: QueueUseCase,
        private readonly notifyFriendsStatusUsecase: NotifyFriendsStatusUseCase,
        private readonly friends: IMutualFriendsStatusUseCase
    ) {}

    async onInviteSend(io: Server, socket: Socket, payload: InviteSendEvent) {
       
        const room  = await this.inviteUserUsecase.execute(payload);

        socket.join(room!.roomId);   

        socket.emit("room_created", room);
        io.to(payload.toUserId).emit("invite_received", payload.fromUserId);

        await this.notifyFriendsStatusUsecase.execute(io, payload.fromUserId, "connected");
    }


    async onAcceptInvite(io: Server, socket: Socket, data: AcceptInviteEvent) {
        const room = await this.acceptInviteUsecase.execute(data.roomId, data.guestData);

        socket.join(room!.roomId);

        io.to(room!.roomId).emit("room_members_updated", "join", room);

        await this.notifyFriendsStatusUsecase.execute(io, data.guestData.id, "connected");
      
    }

    async onRejectInvite(io: Server, socket: Socket, data: RejectInviteEvent) {
        await this.rejectInviteUsecase.execute(data.hostId, data.guestId);

        io.to(data.hostId).emit("invite_rejected", { guestId: data.guestId });

        await this.notifyFriendsStatusUsecase.execute(io, data.guestId, "none"); // 🔥
    }



    async onLeaveRoom(io: Server, socket: Socket, data: LeaveRoomEvent) {
      
        const res = await this.leaveRoomUsecase.execute(data.userId, data.roomId);     
          

        if (res?.deleted){
            io.to(data.roomId).emit("room_deleted");
        }else {
            io.to(data.roomId).emit("room_members_updated", "left", res?.updated, data.userId);
            socket.emit("room_deleted")
        }

        socket.leave(data.roomId);     
        socket.join(data.userId);

        await this.notifyFriendsStatusUsecase.execute(io, data.userId, "none");

        const friendsMap = await this.friends.execute(data.userId); 
        socket.emit("sync_friends_status", friendsMap); 
    }

    async onRemoveUser(io: Server, socket: Socket, data: RemoveUserEvent) {
        const res = await this.leaveRoomUsecase.execute(data.userId, data.roomId);

        io.to(data.roomId).emit("room_members_updated", "remove", res?.updated, data.userId);

        await this.notifyFriendsStatusUsecase.execute(io, data.userId, "none");
    }


    async onPlayerAction(io: Server, data: PlayerActionEvent) {
        await this.playerActionUsecase.execute(data.roomId, data.songData);
        io.to(data.roomId).emit("player_action", data.songData);
    }

    async onAddQueue(io: Server, data: AddToQueueEvent) {
        await this.queueUsecase.add(data.roomId, data.song);
        io.to(data.roomId).emit("queue_updated", data.song);
    }

    async onRemoveQueue(io: Server, data: RemoveFromQueueEvent) {
        await this.queueUsecase.remove(data.roomId, data.songId);
        io.to(data.roomId).emit("song_removed", data.songId);
    }

    onPlayerTick(socket: Socket, data: PlayerTickEvent) {
        socket.to(data.roomId).emit("player_tick", {
            time: data.time,
            isPlaying: data.isPlaying
        });
    }

}
