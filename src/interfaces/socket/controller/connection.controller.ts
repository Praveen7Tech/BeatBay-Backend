import { Server, Socket } from "socket.io";
import { IRegisterUserUseCase } from "../../../application/interfaces/usecase/private-room/register-user-usecase.interface";

export class ConnectionController {
  constructor(
    private readonly _registerUserUsecase: IRegisterUserUseCase
  ) {}

  async onRegister(io: Server, socket: Socket, userId: string) {

    socket.join(userId);

    const { roomData, friendsMap } = await this._registerUserUsecase.execute(userId);

    if (roomData) {
      socket.join(roomData.roomId);
      socket.emit("restore_room_state", roomData);
    }

    socket.emit("sync_friends_status", friendsMap);
  }
}
