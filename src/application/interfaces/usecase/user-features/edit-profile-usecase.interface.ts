import { ProfileResponse } from "../../../dto/artist/artist.profile.dto";
import { EditProfileRequestDTO } from "../../../dto/profile/profile.dto";
import { UploadFile } from "../artist-features/edit-profile-usecase.interface";


export interface IEditProfileUseCase {
    execute(userId: string, request: EditProfileRequestDTO, file?: UploadFile): Promise<ProfileResponse>;
}