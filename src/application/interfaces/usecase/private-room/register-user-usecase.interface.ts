import { RoomData } from "../../../../domain/services/redis/jamCache.service";
import { RegisterUserResponseDTO } from "../../../dto/private-room/register-user.dto";

export interface IRegisterUserUseCase{
    execute(userId: string): Promise<RoomData | null>
}