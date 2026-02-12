import { RoomData } from "../../../domain/services/redis/jamCache.service";

export interface LeaveRoomResponseDTO {
  type: "ROOM_DELETED" | "MEMBER_LEFT";
  room?: RoomData;   
  message: string  
}
