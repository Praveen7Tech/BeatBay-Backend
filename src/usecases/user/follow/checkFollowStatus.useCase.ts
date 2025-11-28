import { IUserRepository } from "../../../domain/repositories/user.repository";

export class CheckFollowStatusUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(userId: string, artistId: string): Promise<boolean> {
        return this.userRepository.isFollowing(userId, artistId);
    }
}