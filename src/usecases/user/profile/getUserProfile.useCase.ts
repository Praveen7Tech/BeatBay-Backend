import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ProfileMapper } from "../../../application/mappers/user/profile/profile.mapper";
import { UserProfileResponseDTO } from "../../../application/dto/profile/profile.dto";

export class GetUserProfileUseCase{
    constructor(
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<UserProfileResponseDTO>{

        const userData = await this._userRepository.getUserProfileDetails(userId)

        return ProfileMapper.toResponseDTO(userData!)
    }
}    