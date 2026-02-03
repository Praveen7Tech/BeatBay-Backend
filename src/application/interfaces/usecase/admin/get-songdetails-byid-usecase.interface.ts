import { Song, SongNew } from "../../../../domain/entities/song.entity";

export interface IAdminGetSongDetailsByIdUseCase {
    execute(songId: string): Promise<SongNew | null>;
}