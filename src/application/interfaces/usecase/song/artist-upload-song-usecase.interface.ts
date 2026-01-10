import { UploadSongDTO } from "../../../dto/song/song.dto";

export interface IUploadSongUseCase {
    execute(artistId: string, request: UploadSongDTO): Promise<{ success: boolean }>;
}