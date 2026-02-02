
import { ClientSession } from "mongoose";
import { Song, SongNew } from "../entities/song.entity";
import { GetAllSongsRequest } from "../interfaces/songRequest";

export type CreateSongData = Omit<SongNew, '_id' | 'createdAt' | 'updatedAt' | 'playCount' | 'likesCount'>;

export interface ISongRepository{
    create(songData: CreateSongData, session?:ClientSession): Promise<Song>;
    getAll(): Promise<Song[]>
    findById(id: string): Promise<SongNew | null>
    songHydration(id: string): Promise<Song | null>
    searchByQuery(query: string, options?: {limit?: number; offset?: number}): Promise<Song[]>
    edit(songId: string, data: Partial<Song>, session?: ClientSession): Promise<Song | null>;
    delete(songId: string, session: ClientSession): Promise<boolean>
    findSongsByIds(ids: string[]): Promise<Song[]>;
    getAllSongs(page: number, limit: number, query?: string): Promise<{songs: Song[], total: number}>
    adminfindById(id: string): Promise<Song | null>
    admingetAllSongs(params: GetAllSongsRequest): Promise<{ songs: Song[], total: number }>;
    updateStatus(id: string, status: boolean): Promise<Song | null>;
    updatePlayCount(songId: string): Promise<void>
}
