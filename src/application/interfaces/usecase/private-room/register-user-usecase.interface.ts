import { RoomData } from "../../../../domain/services/redis/jamCache.service";

export interface IRegisterUserUseCase{
    execute(userId: string): Promise<RoomData | null>
}