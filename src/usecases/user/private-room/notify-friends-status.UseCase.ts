import { Server } from "socket.io";
import { IMutualFriendsStatusUseCase } from "../../../application/interfaces/usecase/mutual-friends/mutual-friends-status-usecase.interface";

export class NotifyFriendsStatusUseCase {
  constructor(
    private readonly friends: IMutualFriendsStatusUseCase
  ) {}

  async execute(io: Server, userId: string, newState: "connected" | "none") {
    const friendsStatusMap = await this.friends.execute(userId);

    const friendIds = Object.keys(friendsStatusMap).filter(
      (fid) => friendsStatusMap[fid] === "none"
    );

    friendIds.forEach((fid) => {
      io.to(fid).emit("friend_status_changed", {
        friendId: userId,
        status: newState,
      });
    });
  }
}
