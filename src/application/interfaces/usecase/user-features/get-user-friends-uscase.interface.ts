import { FriendsResponseDTO } from "../../../dto/friends/friends.dto";

export interface IGetUserFriendsUseCase {
    execute(userId: string): Promise<FriendsResponseDTO>;
}