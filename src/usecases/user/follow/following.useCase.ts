import { IUserRepository } from "../../../domain/repositories/user.repository";
import { FollowersResponseDTO } from "../../../application/dto/follow/following.dto";
import { FollowMapper } from "../../../application/mappers/user/follow/follow.mapper"; 

export class GetFollowingListUseCase {
    constructor(private readonly _userRepository: IUserRepository) {}

    async execute( userId: string, page: number, limit: number ): Promise<FollowersResponseDTO> {

        const { docs, total } = await this._userRepository.following(userId, page, limit);

        return {
            docs: FollowMapper.toFollowingDTOs(docs),
            totalPages: Math.ceil(total / limit) || 1,
            currentPage: page,
            totalDocs: total
        };
    }
}
