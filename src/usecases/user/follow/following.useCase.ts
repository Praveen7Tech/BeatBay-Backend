import { IUserRepository } from "../../../domain/repositories/user.repository";
import { FollowingResponseDTO } from "../../dto/follow/following.dto";
import { Artist } from "../../../domain/entities/arist.entity"; 

export class GetFollowingListUseCase{
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<FollowingResponseDTO[]>{

        const following = await this.userRepository.following(userId);

        const result = following.map(follow => ({
            id: follow._id?.toString(),
            name: follow.name,
            role: follow.role,
            profilePicture: follow?.profilePicture  
        }));

        return result;
    }
}
