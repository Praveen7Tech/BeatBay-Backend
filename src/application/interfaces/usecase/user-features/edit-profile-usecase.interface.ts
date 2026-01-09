import { EditProfileRequestDTO, EditProfileResponseDTO } from "../../../dto/profile/profile.dto";


export interface IEditProfileUseCase {
    execute(userId: string, request: EditProfileRequestDTO): Promise<EditProfileResponseDTO>;
}