import { RoomData, RoomMember } from "../../../../domain/services/redis/jamCache.service";


export interface IAcceptInviteUseCase {
  execute(roomId: string,guestData: Omit<RoomMember, "role">): Promise<RoomData>;
}