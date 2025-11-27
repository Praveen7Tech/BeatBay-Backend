import { IUserRepository } from "../../../domain/repositories/user.repository";

export class BlockUserUseCase{
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<boolean>{

        const user = await this.userRepository.blockById(userId)

        return user 
    }
}