import { IUserRepository } from "../../../domain/repositories/user.repository";

export class UnBlockUserUseCase{
    constructor(
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<boolean>{

        const user = await this._userRepository.unBlockById(userId)

        return user
    }
}