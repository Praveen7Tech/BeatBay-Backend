import { Song } from "../../../../domain/entities/song.entity";

export interface IAdminGetSongDetailsByIdUseCase {
    execute(songId: string): Promise<Song | null>;
}