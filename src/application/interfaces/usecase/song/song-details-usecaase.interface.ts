import { SongResponseDTO } from "../../../dto/song/song.response.dto";

export interface ISongDetailsUseCase {
    execute(songId: string): Promise<SongResponseDTO>;
}