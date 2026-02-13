import { IUnRegisterSocketUseCase } from "../../../application/interfaces/usecase/socket/unRegister-socket-usecase.interface";
import { ISocketCacheService } from "../../../domain/services/redis/jamCache.service";

export class UnregisterSocketUseCase implements IUnRegisterSocketUseCase{
    constructor(
        private readonly _socketCacheService: ISocketCacheService,
    ){}

    async execute(userId: string): Promise<void> {
        
        await this._socketCacheService.setUserOffline(userId)
    }
}