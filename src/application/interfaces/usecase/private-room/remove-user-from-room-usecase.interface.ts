import { RoomData } from "../../../../domain/services/redis/jamCache.service";

export interface IRemoveUserUseCase {
  execute(userId: string, roomId: string): Promise<RoomData>;
}
