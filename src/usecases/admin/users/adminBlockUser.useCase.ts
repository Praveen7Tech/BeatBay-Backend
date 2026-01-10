import { IBlockUserUseCase } from "../../../application/interfaces/usecase/admin/block-user-usecase.interface";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class BlockUserUseCase implements IBlockUserUseCase{
    constructor(
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<boolean>{

        const user = await this._userRepository.blockById(userId)

        return user 
    }
}