import { Song } from "../../../../domain/entities/song.entity";

export interface IGetSongDetailsByIdUseCase {
    execute(songId: string): Promise<Song | null>;
}