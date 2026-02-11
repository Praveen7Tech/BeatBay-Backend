import {  ProfileResponse } from "../../../dto/artist/artist.profile.dto";
import { EditProfileRequestDTO } from "../../../dto/profile/profile.dto";

export interface UploadFile {
  buffer: Buffer;
  mimeType: string;
}

export interface IArtistEditProfileUsecase {
    execute(userId: string,request: EditProfileRequestDTO,file?:UploadFile): Promise<ProfileResponse>;
}
