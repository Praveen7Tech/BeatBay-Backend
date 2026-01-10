import { IUnBlockUserUseCase } from "../../../application/interfaces/usecase/admin/unblock-user-usecase.interface";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class UnBlockUserUseCase implements IUnBlockUserUseCase{
    constructor(
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<boolean>{

        const user = await this._userRepository.unBlockById(userId)

        return user
    }
}