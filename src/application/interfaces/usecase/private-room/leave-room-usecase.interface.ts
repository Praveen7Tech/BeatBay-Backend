import { LeaveRoomResponseDTO } from "../../../dto/private-room/leave-rron-response.dto";


export interface ILeaveRoomUseCase {
  execute(userId: string, roomId: string): Promise<LeaveRoomResponseDTO>;
}
