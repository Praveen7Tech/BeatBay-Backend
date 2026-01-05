
import { FollowersResponseDTO, FollowingResponseDTO } from "../../../application/dto/follow/following.dto";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class GetProfileFollowersPreviewUseCase {
    constructor(private readonly _userRepository: IUserRepository) {}

    async execute(userId: string, page: number, limit: number): Promise<FollowersResponseDTO> {
        const { followers, total } = await this._userRepository.getFollowersList(userId, page, limit);
        
        // 1. Map the array correctly
        const followersList: FollowingResponseDTO[] = followers.map(f => ({
            id: f._id, // Ensure this matches your Repository property name (_id or id)
            name: f.name,
            role: f.role,
            profilePicture: f.profilePicture || ''
        }));

        // 2. Return the structured object matching the interface
        return {
            docs: followersList,
            totalPages: Math.ceil(total / limit) || 1,
            currentPage: page,
            totalDocs: total
        };
    }
}
