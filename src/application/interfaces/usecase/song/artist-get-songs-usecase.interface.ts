import { Song } from "../../../../domain/entities/song.entity";

export interface IGetSongsUseCase {
    execute(artistId: string): Promise<Song[]>;
}