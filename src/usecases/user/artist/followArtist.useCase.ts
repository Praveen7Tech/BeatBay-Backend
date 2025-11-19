import { IUserRepository } from "../../../domain/repositories/user.repository";

export class FollowArtistUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(userId: string, artistId: string): Promise<void> {
        
        if (userId === artistId) {
            throw new Error("Cannot follow yourself.");
        }
        return this.userRepository.addFollow(userId, artistId);
    }
}