import { EditSongDTO } from "../../../dto/song/song.dto";

export interface IEditSongUseCase {
    execute(songId: string, request: Partial<EditSongDTO>): Promise<{ success: boolean }>;
}