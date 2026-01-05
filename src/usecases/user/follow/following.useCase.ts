import { IUserRepository } from "../../../domain/repositories/user.repository";
import { FollowersResponseDTO, FollowingResponseDTO } from "../../../application/dto/follow/following.dto";

export class GetFollowingListUseCase {
    constructor(private readonly _userRepository: IUserRepository) {}

    async execute(userId: string, page: number, limit: number): Promise<FollowersResponseDTO> {
        const { docs, total } = await this._userRepository.following(userId, page, limit);

        const mappedList: FollowingResponseDTO[] = docs.map((item) => ({
            id: item._id.toString(),
            name: item.name,
            role: item.role,
            profilePicture: item.profilePicture ?? ''
        }));

        return {
            docs: mappedList,
            totalPages: Math.ceil(total / limit) || 1,
            currentPage: page,
            totalDocs: total
        };
    }
}