
import { ClientSession } from "mongoose";
import { Song } from "../entities/song.entity";

export type CreateSongData = Omit<Song, '_id' | 'createdAt' | 'updatedAt' | 'playCount' | 'likesCount'>;

export interface ISongRepository {
    create(songData: CreateSongData, session?:ClientSession): Promise<Song>;
    getAll(): Promise<Song[]>
}
