import { Song } from "../../../../domain/entities/song.entity";

export interface IFetchSongsUsecase {
    execute(): Promise<Song[]>;
}