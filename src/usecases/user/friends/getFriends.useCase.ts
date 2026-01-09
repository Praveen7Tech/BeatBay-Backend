import { FriendsResponseDTO } from "../../../application/dto/friends/friends.dto";
import { IGetUserFriendsUseCase } from "../../../application/interfaces/usecase/user-features/get-user-friends-uscase.interface";
import { FriendsMapper } from "../../../application/mappers/user/friends/friends.mapper";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class GetUserFriendsUseCase implements IGetUserFriendsUseCase{
    constructor(
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<FriendsResponseDTO>{

        const friends = await this._userRepository.getMutualFriends(userId)

        const mapppedUser = FriendsMapper.toDTOList(friends!)
        return {
            friends: mapppedUser
        }
    }
}