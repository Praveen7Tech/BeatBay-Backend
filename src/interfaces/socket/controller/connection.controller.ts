import { Server, Socket } from "socket.io";
import { IRegisterUserUseCase } from "../../../application/interfaces/usecase/private-room/register-user-usecase.interface";
import { IUnRegisterSocketUseCase } from "../../../application/interfaces/usecase/socket/unRegister-socket-usecase.interface";
import logger from "../../../infrastructure/utils/logger/logger";
import { IMutualFriendsStatusUseCase } from "../../../application/interfaces/usecase/mutual-friends/mutual-friends-status-usecase.interface";
import { INotificationsUsecase } from "../../../application/interfaces/usecase/notifications/get-notifications-usecase.interface";

export class ConnectionController {
  constructor(
    private readonly _registerUserUsecase: IRegisterUserUseCase,
    private readonly _unRegisterUserSocketUsecase: IUnRegisterSocketUseCase,
    private readonly _friendsStatusUsecase: IMutualFriendsStatusUseCase,
    private readonly _notificationsUsecase: INotificationsUsecase
  ) {}

  private disconnectionTimers = new Map<string, NodeJS.Timeout>()

  async onRegister(io: Server, socket: Socket, userId: string) {

    socket.data.userId = userId;
    socket.join(userId);

    const roomData = await this._registerUserUsecase.execute(userId);
    const friendsMap  = await this._friendsStatusUsecase.execute(userId);
    const notifications = await this._notificationsUsecase.execute(userId)

    if(this.disconnectionTimers.has(userId)){
      clearTimeout(this.disconnectionTimers.get(userId))
      this.disconnectionTimers.delete(userId)

      logger.info(`User ${userId} refreshed - Cancelled offline broadcast`);

    }else{
      const friendsIds = Object.keys(friendsMap)

      friendsIds.forEach(fid=>{
        io.to(fid).emit("friend_status_changed",{
          friendId: userId, status: roomData ? "connected" : "none"
        })
      })
    }

    if (roomData) {
      socket.join(roomData.roomId);
      socket.emit("restore_room_state", roomData);
    }
    if(notifications.length){
      socket.emit("update_notifications", notifications)
    }

    socket.emit("sync_friends_status", friendsMap);
  }

  async Disconnect(io:Server, socket: Socket){
    const userId = socket.data.userId;
    if (!userId) return;

    logger.info(`User ${userId} socket disconnected. Waiting for refresh...`);

    // manage the private room when host disconnect
    const room = await this._registerUserUsecase.execute(userId)
    if(room && room.hostId === userId){
      io.to(room.roomId).emit("host_playback_pause")
      logger.info(`Host ${userId} disconnected → pausing playback`)
    }

    const timer = setTimeout(async () => {
      await this._unRegisterUserSocketUsecase.execute(userId);
      
      const friends = await this._friendsStatusUsecase.execute(userId);
      Object.keys(friends).forEach(fid => {
        io.to(fid).emit("friend_status_changed", {
          friendId: userId, 
          status: "offline"
        });
      });
      
      this.disconnectionTimers.delete(userId);
      logger.info(`User ${userId} officially offline.`);
    }, 5000); 

    this.disconnectionTimers.set(userId, timer);
  }
}
