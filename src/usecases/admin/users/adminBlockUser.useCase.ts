import { IUserRepository } from "../../../domain/repositories/user.repository";

export class BlockUserUseCase{
    constructor(
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<boolean>{

        const user = await this._userRepository.blockById(userId)

        return user 
    }
}