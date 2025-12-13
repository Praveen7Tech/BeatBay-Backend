
import { ClientSession } from "mongoose";
import { Song } from "../entities/song.entity";

export type CreateSongData = Omit<Song, '_id' | 'createdAt' | 'updatedAt' | 'playCount' | 'likesCount'>;

export interface ISongRepository{
    create(songData: CreateSongData, session?:ClientSession): Promise<Song>;
    getAll(): Promise<Song[]>
    findById(id: string): Promise<Song | null>
    searchByQuery(query: string, options?: {limit?: number; offset?: number}): Promise<Song[]>
    edit(songId: string, data: Partial<Song>, session?: ClientSession): Promise<Song | null>;
    delete(songId: string, session: ClientSession): Promise<boolean>
    countDocuments(): Promise<number>
    findSongsByIds(ids: string[]): Promise<Song[]>;
}
