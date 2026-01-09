import { SongHydrationResponseDTO } from "../../../dto/song/song.response.dto";

export interface ISongHydrationUseCase {
    execute(songId: string): Promise<SongHydrationResponseDTO>;
}