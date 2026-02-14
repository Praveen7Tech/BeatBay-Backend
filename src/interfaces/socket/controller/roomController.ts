
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
import { ISendNotificationsUseCase } from "../../../application/interfaces/usecase/notifications/send-notifications-usecase.interface";
import logger from "../../../infrastructure/utils/logger/logger";

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
        private readonly _friendsStatusUsecase: IMutualFriendsStatusUseCase,
        private readonly _sendNotificationUsecase: ISendNotificationsUseCase
    ) {}

    async onInviteSend(io: Server, socket: Socket, payload: InviteSendEvent) {
       
        const {room } = await this._inviteUserUsecase.execute(payload);

        const notification = await this._sendNotificationUsecase.execute({
            recipientId: payload.toUserId,
            senderId: payload.fromUserId,
            type: "INVITE",
            roomId: room.roomId
        })

        socket.join(room.roomId);   

        socket.emit("room_created", room);
        io.to(payload.toUserId).emit("invite_received", payload.fromUserId);
        io.to(payload.toUserId).emit("notification_recieved", notification)

        await this._notifyFriendsStatusUsecase.execute(io, {
            userId: payload.fromUserId,
            newState: "connected",
        });
    }

    async onAcceptInvite(io: Server, socket: Socket, data: AcceptInviteEvent) {
        const room = await this._acceptInviteUsecase.execute(data.roomId, data.guestData);

        const notification = await this._sendNotificationUsecase.execute({
            recipientId: data.guestData.id,
            senderId: room.roomId,
            type: "JOINED",
            roomId: room.roomId
        })

        socket.join(room!.roomId);

        socket.to(room.roomId).emit("notification_recieved", notification);

        socket.emit("notification_recieved", {
            message: `You joined the room!`,
            isTemp: true
        });

        io.to(room!.roomId).emit("room_members_updated", "join", room);

        await this._notifyFriendsStatusUsecase.execute(io, {
            userId: data.guestData.id,
            newState: "connected",
        });
      
    }

    async onRejectInvite(io: Server, socket: Socket, data: RejectInviteEvent) {
        await this._rejectInviteUsecase.execute(data.hostId, data.guestId);

        const notification = await this._sendNotificationUsecase.execute({
            recipientId: data.hostId,
            senderId: data.guestId,
            type: "REJECT",
            roomId: data.hostId
        })

        io.to(data.hostId).emit("invite_rejected", { guestId: data.guestId });
        io.to(data.hostId).emit("notification_recieved", notification)

       await this._notifyFriendsStatusUsecase.execute(io, {
            userId: data.guestId,
            newState: "none",
        }); 
    }

    async onLeaveRoom(io: Server, socket: Socket, data: LeaveRoomEvent) {
        const result = await this._leaveRoomUsecase.execute(data.userId, data.roomId);

        if (result.type === "ROOM_DELETED") {
            io.to(data.roomId).emit("notification_recieved",{
                message: result.message,
                isTemp: true
            });

            // remove ALL sockets from this room
            const sockets = await io.in(data.roomId).fetchSockets();      
            for (const s of sockets) {
                s.leave(data.roomId);
                s.emit("room_deleted");
            }
        }

        if (result.type === "MEMBER_LEFT") {
            io.to(data.roomId).emit(
                "room_members_updated",
                "left",
                result.room,
                data.userId
            );

            io.to(data.roomId).emit("notification_recieved", {
                message: result.message,
                isTemp: true
            });

            // remove only this user's socket from the room
            socket.leave(data.roomId);
            socket.emit("room_deleted");
        }

        socket.join(data.userId);

        await this._notifyFriendsStatusUsecase.execute(io, {
            userId: data.userId,
            newState: "none",
        });

        const friendsMap = await this._friendsStatusUsecase.execute(data.userId);
        socket.emit("sync_friends_status", friendsMap);
    }

    async onRemoveUser(io: Server, socket: Socket, data: RemoveUserEvent) {

        const { updatedRoom, message } = await this._removeuserUsecase.execute(data.userId, data.roomId);

        io.to(data.roomId).emit("notification_recieved", {
            message: message,
            isTemp: true
        });
        io.to(data.roomId).emit(
            "room_members_updated",
            "remove",
            updatedRoom,
            data.userId
        );

        //  remove removed user's sockets from room
        const userSockets = await io.in(data.userId).fetchSockets();
        for (const s of userSockets) {
            s.leave(data.roomId);
            s.emit("room_deleted");
            s.emit("notification_recieved", {
                message: "You were removed from the room by host!",
                isTemp: true
            });
        }

        await this._notifyFriendsStatusUsecase.execute(io, {
            userId: data.userId,
            newState: "none",
        });
    }

    async onPlayerAction(io: Server, data: PlayerActionEvent) {
        await this._playerActionUsecase.execute(data.roomId, data.songData);
        io.to(data.roomId).emit("player_action", data.songData);
    }

    async onAddQueue(io: Server,socket: Socket, data: AddToQueueEvent) {

        const userId = socket.data.userId
        if (!userId) {
            return logger.error("Attempted to add to queue without registration");
        }

        const {message} = await this._addToQueueUsecase.execute(data.roomId, data.song, userId);

        io.to(data.roomId).emit("queue_updated", data.song);
        socket.to(data.roomId).emit("notification_recieved", {
            message: message,
            isTemp: true
        });

        // 3. Feedback: Tell ONLY the adder it was successful
        socket.emit("notification_recieved", {
            message: `You added "${data.song.title}" to the queue!`,
            isTemp: true
        });
    }

    async onRemoveQueue(io: Server,socket: Socket, data: RemoveFromQueueEvent) {

        const userId = socket.data.userId;
         if (!userId) {
            return logger.error("Attempted to add to queue without registration");
        }

        const {message, songName} = await this._removeFromQueueUsecase.execute(data.roomId, data.songId, userId);
        io.to(data.roomId).emit("song_removed", data.songId);

        socket.to(data.roomId).emit("notification_recieved", {
            message: message,
            isTemp: true
        })
        socket.emit("notification_recieved", {
            message: `You removed ${songName} from queue`,
            isTemp: true
        })
    }

    onPlayerTick(socket: Socket, data: PlayerTickEvent) {
        socket.to(data.roomId).emit("player_tick", {
            time: data.time,
            isPlaying: data.isPlaying
        });
    }

}
