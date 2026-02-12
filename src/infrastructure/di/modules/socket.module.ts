import { asClass } from "awilix";
import { ConnectionController } from "../../../interfaces/socket/controller/connection.controller";
import { RoomController } from "../../../interfaces/socket/controller/roomController";
import { PlayerActionUseCase } from "../../../usecases/user/private-room/playerAction.UseCase";
import { LeaveRoomUseCase } from "../../../usecases/user/private-room/leaveRoom.UseCase";
import { AcceptInviteUseCase } from "../../../usecases/user/private-room/acceptInvite.UseCase";
import { InviteUserUseCase } from "../../../usecases/user/private-room/inviteUser.UseCase";
import { RegisterUserUseCase } from "../../../usecases/user/private-room/registerRoom.UseCase";
import { SocketCacheService } from "../../cache/jam-cache/jam-cache.service";
import { MutualFriendsStatusUseCase } from "../../../usecases/user/friends/mutalFriendsStatus.UseCase";
import { RejectInviteUseCase } from "../../../usecases/user/private-room/rejectInvite.UseCase";
import { NotifyFriendsStatusUseCase } from "../../../usecases/user/private-room/notify-friends-status.UseCase";
import { RemoveUserUseCase } from "../../../usecases/user/private-room/remove-userFromRoom.UseCase";
import { AddToQueueUseCase } from "../../../usecases/user/private-room/addTo-queue.UseCase";
import { RemoveFromQueueUseCase } from "../../../usecases/user/private-room/removeFrom-queue.UseCase";
import { SendNotificationUseCase } from "../../../usecases/user/notifications/sendNotifications.UseCase";
import { INotificationService } from "../../../domain/services/notification/notification.service";
import { NotificationService } from "../../services/notification/notification.service.repository";

export const socketModule = {
  _socketCacheService: asClass(SocketCacheService).singleton(),
  _friendsStatusUsecase: asClass(MutualFriendsStatusUseCase).singleton(),
  _cacheRoomService: asClass(SocketCacheService).singleton(),
  _notificationService: asClass<INotificationService>(NotificationService).singleton(),

  _registerUserUsecase: asClass(RegisterUserUseCase).singleton(),
  _inviteUserUsecase: asClass(InviteUserUseCase).singleton(),
  _acceptInviteUsecase: asClass(AcceptInviteUseCase).singleton(),
  _leaveRoomUsecase: asClass(LeaveRoomUseCase).singleton(),
  _removeuserUsecase: asClass(RemoveUserUseCase).singleton(),
  _playerActionUsecase: asClass(PlayerActionUseCase).singleton(),
  _rejectInviteUsecase: asClass(RejectInviteUseCase).singleton(),
  _addToQueueUsecase: asClass(AddToQueueUseCase).singleton(),
  _removeFromQueueUsecase: asClass(RemoveFromQueueUseCase).singleton(),
  _notifyFriendsStatusUsecase: asClass(NotifyFriendsStatusUseCase).singleton(),

  // notification usecase
  _sendNotificationUsecase: asClass(SendNotificationUseCase).singleton(),

  connectionController: asClass(ConnectionController).singleton(),
  roomController: asClass(RoomController).singleton(),
}