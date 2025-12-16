import { IUserRepository } from "../../../domain/repositories/user.repository";
import { FollowingResponseDTO } from "../../../application/dto/follow/following.dto";

export class GetFollowingListUseCase{
    constructor(
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<FollowingResponseDTO[]>{

        const following = await this._userRepository.following(userId);

        const result = following.map(follow => ({
            id: follow._id?.toString(),
            name: follow.name,
            role: follow.role,
            profilePicture: follow?.profilePicture  
        }));

        return result;
    }
}
