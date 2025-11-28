import { IUserRepository } from "../../../domain/repositories/user.repository";

export class UnBlockUserUseCase{
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<boolean>{

        const user = await this.userRepository.unBlockById(userId)

        return user
    }
}