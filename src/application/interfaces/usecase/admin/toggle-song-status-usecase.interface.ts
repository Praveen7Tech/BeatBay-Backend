import { Song, SongNew } from "../../../../domain/entities/song.entity";

export interface IToggleSongStatusUseCase {
    execute(songId: string, targetStatus: boolean): Promise<SongNew>;
}