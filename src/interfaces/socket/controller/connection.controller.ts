import { Server, Socket } from "socket.io";
import { RegisterUserUseCase } from "../../../usecases/user/private-room/registerRoom.UseCase";

export class ConnectionController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase
  ) {}

  async onRegister(io: Server, socket: Socket, userId: string) {

    socket.join(userId);

    const { roomData, friendsMap } = await this.registerUserUseCase.execute(userId);

    if (roomData) {
      socket.join(roomData.roomId);
      socket.emit("restore_room_state", roomData);
    }

    socket.emit("sync_friends_status", friendsMap);
  }
}
