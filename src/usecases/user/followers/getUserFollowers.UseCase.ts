import { FollowersResponseDTO } from "../../../application/dto/follow/following.dto";
import { IGetProfileFollowersPreviewUseCase } from "../../../application/interfaces/usecase/following/get-profile-followers-prview-usecase.interface";
import { FollowerMapper } from "../../../application/mappers/user/follow/follower.mapper";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class GetProfileFollowersPreviewUseCase implements IGetProfileFollowersPreviewUseCase{
    constructor(private readonly _userRepository: IUserRepository) {}

    async execute(userId: string,page: number,limit: number): Promise<FollowersResponseDTO> {

        const { followers, total } = await this._userRepository.getFollowersList(userId, page, limit);

        return {
            docs: FollowerMapper.toFollowerDTOs(followers),
            totalPages: Math.ceil(total / limit) || 1,
            currentPage: page,
            totalDocs: total
        };
    }
}
