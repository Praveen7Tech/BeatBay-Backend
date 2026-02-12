
import { Server, Socket } from "socket.io";
import { IMutualFriendsStatusUseCase } from "../../../application/interfaces/usecase/mutual-friends/mutual-friends-status-usecase.interface";
import { AcceptInviteEvent, AddToQueueEvent, InviteSendEvent, LeaveRoomEvent, PlayerActionEvent, PlayerTickEvent, RejectInviteEvent, RemoveFromQueueEvent, RemoveUserEvent } from "../../../application/dto/private-room/private.room.dto";
import { IInviteUserUseCase } from "../../../application/interfaces/usecase/private-room/invite-user-usecase.interface";
import { INotifyFriendsStatusUseCase } from "../../../application/interfaces/usecase/private-room/friends-status-usecase.interface";
import { IAcceptInviteUseCase } from "../../../application/interfaces/usecase/private-room/accept-invite-usecase.interface";
import { IRejectInviteUseCase } from "../../../application/interfaces/usecase/private-room/reject-invite-usecase.interface";
import { ILeaveRoomUseCase } from "../../../application/interfaces/usecase/private-room/leave-room-usecase.interface";
import { IRemoveUserUseCase } from "../../../application/interfaces/usecase/private-room/remove-user-from-room-usecase.interface";
import { IPlayerActionUseCase } from "../../../application/interfaces/usecase/private-room/player-action-usecase.interface";
import { IAddToQueueUseCase } from "../../../application/interfaces/usecase/private-room/addTo-queue-usecase.interface";
import { IRemoveFromQueueUseCase } from "../../../application/interfaces/usecase/private-room/removeFrmon-queueu.interface";

export class RoomController {
    constructor(
        private readonly _inviteUserUsecase: IInviteUserUseCase,
        private readonly _acceptInviteUsecase: IAcceptInviteUseCase,
        private readonly _rejectInviteUsecase: IRejectInviteUseCase,
        private readonly _leaveRoomUsecase: ILeaveRoomUseCase,
        private readonly _removeuserUsecase: IRemoveUserUseCase,
        private readonly _playerActionUsecase: IPlayerActionUseCase,
        private readonly _addToQueueUsecase: IAddToQueueUseCase,
        private readonly _removeFromQueueUsecase: IRemoveFromQueueUseCase,
        private readonly _notifyFriendsStatusUsecase: INotifyFriendsStatusUseCase,
        private readonly _friendsStatusUsecase: IMutualFriendsStatusUseCase
    ) {}

    async onInviteSend(io: Server, socket: Socket, payload: InviteSendEvent) {
       
        const {room } = await this._inviteUserUsecase.execute(payload);

        socket.join(room.roomId);   

        socket.emit("room_created", room);
        io.to(payload.toUserId).emit("invite_received", payload.fromUserId);

        await this._notifyFriendsStatusUsecase.execute(io, {
            userId: payload.fromUserId,
            newState: "connected",
        });
    }

    async onAcceptInvite(io: Server, socket: Socket, data: AcceptInviteEvent) {
        const room = await this._acceptInviteUsecase.execute(data.roomId, data.guestData);

        socket.join(room!.roomId);

        io.to(room!.roomId).emit("room_members_updated", "join", room);

        await this._notifyFriendsStatusUsecase.execute(io, {
            userId: data.guestData.id,
            newState: "connected",
        });
      
    }

    async onRejectInvite(io: Server, socket: Socket, data: RejectInviteEvent) {
        await this._rejectInviteUsecase.execute(data.hostId, data.guestId);

        io.to(data.hostId).emit("invite_rejected", { guestId: data.guestId });

       await this._notifyFriendsStatusUsecase.execute(io, {
            userId: data.guestId,
            newState: "none",
        }); 
    }

    async onLeaveRoom(io: Server, socket: Socket, data: LeaveRoomEvent) {
        const result = await this._leaveRoomUsecase.execute(data.userId, data.roomId);

        if (result.type === "ROOM_DELETED") {
            io.to(data.roomId).emit("room_deleted");
        }

        if (result.type === "MEMBER_LEFT") {
            io.to(data.roomId).emit(
            "room_members_updated",
            "left",
            result.room,
            data.userId
            );

            socket.emit("room_deleted");
        }

        socket.leave(data.roomId);
        socket.join(data.userId);

        await this._notifyFriendsStatusUsecase.execute(io, {
            userId: data.userId,
            newState: "none",
        });

        const friendsMap = await this._friendsStatusUsecase.execute(data.userId);
        socket.emit("sync_friends_status", friendsMap);
    }

    async onRemoveUser(io: Server, socket: Socket, data: RemoveUserEvent) {

        const updatedRoom = await this._removeuserUsecase.execute(data.userId, data.roomId);

        io.to(data.roomId).emit("room_members_updated", "remove", updatedRoom, data.userId);

        await this._notifyFriendsStatusUsecase.execute(io, {
            userId: data.userId,
            newState: "none",
        });
    }

    async onPlayerAction(io: Server, data: PlayerActionEvent) {
        await this._playerActionUsecase.execute(data.roomId, data.songData);
        io.to(data.roomId).emit("player_action", data.songData);
    }

    async onAddQueue(io: Server, data: AddToQueueEvent) {
        await this._addToQueueUsecase.execute(data.roomId, data.song);
        io.to(data.roomId).emit("queue_updated", data.song);
    }

    async onRemoveQueue(io: Server, data: RemoveFromQueueEvent) {
        await this._removeFromQueueUsecase.execute(data.roomId, data.songId);
        io.to(data.roomId).emit("song_removed", data.songId);
    }

    onPlayerTick(socket: Socket, data: PlayerTickEvent) {
        socket.to(data.roomId).emit("player_tick", {
            time: data.time,
            isPlaying: data.isPlaying
        });
    }

}
