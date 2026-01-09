import { UserProfileResponseDTO } from "../../../dto/profile/profile.dto";

export interface IGetUserProfileUseCase {
    execute(userId: string): Promise<UserProfileResponseDTO>;
}