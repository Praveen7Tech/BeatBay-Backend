import { EditProfileRequestDTO, EditProfileResponseDTO } from "../../../dto/profile/profile.dto";

export interface IArtistEditProfileUsecase {
    execute(userId: string, request: EditProfileRequestDTO): Promise<EditProfileResponseDTO>;
}