import { Song, SongNew } from "../../../../domain/entities/song.entity";

export interface IGetSongDetailsByIdUseCase {
    execute(songId: string): Promise<SongNew | null>;
}