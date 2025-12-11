import { IUserRepository } from "../../../domain/repositories/user.repository";

export class UnfollowArtistUseCase {
    constructor(private readonly _userRepository: IUserRepository) {}

    async execute(userId: string, artistId: string): Promise<void> {
        return this._userRepository.removeFollow(userId, artistId);
    }
}