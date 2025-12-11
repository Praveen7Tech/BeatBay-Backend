import { IUserRepository } from "../../../domain/repositories/user.repository";

export class CheckFollowStatusUseCase {
    constructor(private readonly _userRepository: IUserRepository) {}

    async execute(userId: string, artistId: string): Promise<boolean> {
        return this._userRepository.isFollowing(userId, artistId);
    }
}