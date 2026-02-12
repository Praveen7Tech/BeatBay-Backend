import { RoomData } from "../../../../domain/services/redis/jamCache.service";
export interface RemoveUserResponse{
  updatedRoom: RoomData,
  message: string
}

export interface IRemoveUserUseCase {
  execute(userId: string, roomId: string): Promise<RemoveUserResponse>;
}
