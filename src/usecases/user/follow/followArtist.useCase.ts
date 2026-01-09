import { IFollowingHandleUseCase } from "../../../application/interfaces/usecase/following/following-handle-usecase.interface";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class FollowingHandleUseCase implements IFollowingHandleUseCase{
    constructor(private readonly _userRepository: IUserRepository) {}

    async execute(followId: string, targetId: string, role: string, action: string): Promise<void> {
        
        if (followId === targetId) {
            throw new Error("Cannot follow yourself.");
        }
        
        return this._userRepository.toggleFollow(followId, targetId, role, action);
    }
}