
import { AdminSongDetailsDTO } from "../../../dto/admin/songs/songDetails.dto";

export interface IAdminGetSongDetailsByIdUseCase {
    execute(songId: string): Promise<AdminSongDetailsDTO | null>;
}