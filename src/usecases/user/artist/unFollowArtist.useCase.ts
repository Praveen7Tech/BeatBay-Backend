import { IUserRepository } from "../../../domain/repositories/user.repository";

export class UnfollowArtistUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(userId: string, artistId: string): Promise<void> {
        return this.userRepository.removeFollow(userId, artistId);
    }
}