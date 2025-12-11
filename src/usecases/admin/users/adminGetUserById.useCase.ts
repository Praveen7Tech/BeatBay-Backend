import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class GetUserByIdUseCase{
    constructor(
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<User | null>{

        const user = await this._userRepository.findById(userId)

        return user
    }
}