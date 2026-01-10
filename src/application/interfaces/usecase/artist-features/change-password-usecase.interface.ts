import { ChangePasswordRequestDTO } from "../../../dto/profile/profile.dto";

export interface IArtistChangePasswordUsecase {
    execute(artistId: string, request: ChangePasswordRequestDTO): Promise<{ success: boolean }>;
}
