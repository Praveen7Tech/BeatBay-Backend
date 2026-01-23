import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ProfileMapper } from "../../../application/mappers/user/profile/profile.mapper";
import { UserProfileResponseDTO } from "../../../application/dto/profile/profile.dto";
import { IGetUserProfileUseCase } from "../../../application/interfaces/usecase/user-features/get-user-profile-usecase.interface";
import { IFollowersRepository } from "../../../domain/repositories/followers.repository";

export class GetUserProfileUseCase implements IGetUserProfileUseCase{
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _mongoosefollowersRepository: IFollowersRepository
    ){}

    async execute(userId: string): Promise<UserProfileResponseDTO>{

        const userData = await this._userRepository.getUserProfileDetails(userId)
        const {followers } = await this._mongoosefollowersRepository.getFollowersList(userId,1,10)

        return ProfileMapper.toResponseDTO(userData!,followers)
    }
}    