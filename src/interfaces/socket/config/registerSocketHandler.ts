import { Server, Socket } from "socket.io";
import { ConnectionController } from "../controller/connection.controller";
import { RoomController } from "../controller/roomController";
import container from "../../../infrastructure/di/container";
import { AcceptInviteEvent, AddToQueueEvent, InviteSendEvent, LeaveRoomEvent, PlayerActionEvent, PlayerTickEvent, RejectInviteEvent, RemoveFromQueueEvent, RemoveUserEvent } from "../../../application/dto/private-room/private.room.dto";
import logger from "../../../infrastructure/utils/logger/logger";

export const registerSocketHandlers = (io: Server) => {

  const connectionCtrl = container.resolve<ConnectionController>("connectionController")
  const roomCtrl = container.resolve<RoomController>("roomController");

  io.on("connection", (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on("register", (userId: string) => connectionCtrl.onRegister(io, socket, userId));

    socket.on("invite_send", (data: InviteSendEvent) => roomCtrl.onInviteSend(io, socket, data));
    socket.on("accept_invite", (data:AcceptInviteEvent) => roomCtrl.onAcceptInvite(io, socket, data));
    socket.on("reject_invite", (data: RejectInviteEvent) => roomCtrl.onRejectInvite(io, socket, data));
    socket.on("left_room", (data: LeaveRoomEvent) => roomCtrl.onLeaveRoom(io, socket, data));
    socket.on("remove_user", (data: RemoveUserEvent) => roomCtrl.onRemoveUser(io, socket, data));
    socket.on("player_action", (data: PlayerActionEvent) => roomCtrl.onPlayerAction(io, data));
    socket.on("addTo_queue", (data: AddToQueueEvent) => roomCtrl.onAddQueue(io,socket, data));
    socket.on("removeFromQueue", (data: RemoveFromQueueEvent) => roomCtrl.onRemoveQueue(io,socket, data));
    //socket.on("player_tick", (data: PlayerTickEvent) => roomCtrl.onPlayerTick(socket, data));

    socket.on("disconnect", () => connectionCtrl.Disconnect(io, socket));
  });
};