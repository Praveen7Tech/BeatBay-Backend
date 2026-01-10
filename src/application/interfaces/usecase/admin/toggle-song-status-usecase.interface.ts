import { Song } from "../../../../domain/entities/song.entity";

export interface IToggleSongStatusUseCase {
    execute(songId: string, targetStatus: boolean): Promise<Song>;
}