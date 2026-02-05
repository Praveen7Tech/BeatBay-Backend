import { SongPerformanceDTO } from "../../../dto/artist/song/song.performance.dto";

export interface IGetSongPerformanceUseCase {
    execute(songId: string, days: number): Promise<SongPerformanceDTO[]>;
}
