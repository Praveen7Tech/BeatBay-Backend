import { IUserRepository } from "../../../domain/repositories/user.repository";

export class FollowingHandleUseCase {
    constructor(private readonly _userRepository: IUserRepository) {}

    async execute(followId: string, targetId: string, role: string, action: string): Promise<void> {
        
        if (followId === targetId) {
            throw new Error("Cannot follow yourself.");
        }
        //return this._userRepository.addFollow(userId, artistId);
        return this._userRepository.toggleFollow(followId, targetId, role, action);
    }
}