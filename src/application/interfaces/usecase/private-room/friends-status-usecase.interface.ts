import { Server } from "socket.io";
import { NotifyFriendsStatusDTO } from "../../../dto/private-room/notify-friends.dto";

export interface INotifyFriendsStatusUseCase {
  execute(io: Server, data: NotifyFriendsStatusDTO): Promise<void>;
}