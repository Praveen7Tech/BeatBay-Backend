import { Server } from "socket.io";
import { IMutualFriendsStatusUseCase } from "../../../application/interfaces/usecase/mutual-friends/mutual-friends-status-usecase.interface";
import { NotifyFriendsStatusDTO } from "../../../application/dto/private-room/notify-friends.dto";
import { INotifyFriendsStatusUseCase } from "../../../application/interfaces/usecase/private-room/friends-status-usecase.interface";

export class NotifyFriendsStatusUseCase implements INotifyFriendsStatusUseCase {
  constructor(
    private readonly _friendsStatusUsecase: IMutualFriendsStatusUseCase
  ) {}

  async execute(io: Server, data: NotifyFriendsStatusDTO): Promise<void> {
    const friendsStatusMap = await this._friendsStatusUsecase.execute(data.userId);

    const friendIds = Object.keys(friendsStatusMap).filter(
      (fid) => friendsStatusMap[fid] === "none"
    );

    friendIds.forEach((fid) => {
      io.to(fid).emit("friend_status_changed", {
        friendId: data.userId,
        status: data.newState,
      });
    });
  }
}

