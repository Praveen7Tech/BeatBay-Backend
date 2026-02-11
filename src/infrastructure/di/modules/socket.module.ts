import { asClass } from "awilix";
import { ConnectionController } from "../../../interfaces/socket/controller/connection.controller";
import { RoomController } from "../../../interfaces/socket/controller/roomController";
import { QueueUseCase } from "../../../usecases/user/private-room/queue.UseCase";
import { PlayerActionUseCase } from "../../../usecases/user/private-room/playerAction.UseCase";
import { LeaveRoomUseCase } from "../../../usecases/user/private-room/leaveRoom.UseCase";
import { AcceptInviteUseCase } from "../../../usecases/user/private-room/acceptInvite.UseCase";
import { InviteUserUseCase } from "../../../usecases/user/private-room/inviteUser.UseCase";
import { RegisterUserUseCase } from "../../../usecases/user/private-room/registerRoom.UseCase";
import { SocketCacheService } from "../../cache/jam-cache/jam-cache.service";
import { MutualFriendsStatusUseCase } from "../../../usecases/user/friends/mutalFriendsStatus.UseCase";
import { RejectInviteUseCase } from "../../../usecases/user/private-room/rejectInvite.UseCase";
import { NotifyFriendsStatusUseCase } from "../../../usecases/user/private-room/notify-friends-status.UseCase";

export const socketModule = {
  socketCacheService: asClass(SocketCacheService).singleton(),
  friends: asClass(MutualFriendsStatusUseCase).singleton(),
  _cacheRoomService: asClass(SocketCacheService).singleton(),

  registerUserUseCase: asClass(RegisterUserUseCase).singleton(),
  inviteUserUsecase: asClass(InviteUserUseCase).singleton(),
  acceptInviteUsecase: asClass(AcceptInviteUseCase).singleton(),
  leaveRoomUsecase: asClass(LeaveRoomUseCase).singleton(),
  playerActionUsecase: asClass(PlayerActionUseCase).singleton(),
  queueUsecase: asClass(QueueUseCase).singleton(),
  rejectInviteUsecase: asClass(RejectInviteUseCase).singleton(),
  notifyFriendsStatusUsecase: asClass(NotifyFriendsStatusUseCase).singleton(),

  connectionController: asClass(ConnectionController).singleton(),
  roomController: asClass(RoomController).singleton(),
}