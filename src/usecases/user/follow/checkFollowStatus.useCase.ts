import { ICheckFollowStatusUseCase } from "../../../application/interfaces/usecase/following/check-follow-status-usecase.interface";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class CheckFollowStatusUseCase implements ICheckFollowStatusUseCase{
    constructor(private readonly _userRepository: IUserRepository) {}

    async execute(followId: string, targetId: string, role: string): Promise<boolean> {
        return this._userRepository.isFollowing(followId, targetId, role);
    }
}