
import { ClientSession } from "mongoose";
import { Song, SongNew } from "../entities/song.entity";
import { GetAllSongsRequest } from "../interfaces/songRequest";

export type CreateSongData = Omit<SongNew, 'createdAt' | 'updatedAt' | 'playCount' | 'likesCount'>;

export interface ISongRepository{
    create(songData: CreateSongData, session?:ClientSession): Promise<SongNew>;
    getAll(): Promise<SongNew[]>
    findById(id: string): Promise<SongNew | null>
    //songHydration(id: string): Promise<Song | null>
    searchByQuery(query: string, options?: {limit?: number; offset?: number}): Promise<SongNew[]>
    edit(songId: string, data: Partial<Song>, session?: ClientSession): Promise<Song | null>;
    delete(songId: string, session: ClientSession): Promise<boolean>
    findSongsByIds(ids: string[]): Promise<SongNew[]>;
    getAllSongs(page: number, limit: number, query?: string): Promise<{songs: SongNew[], total: number}>
    adminfindById(id: string): Promise<SongNew | null>
    admingetAllSongs(params: GetAllSongsRequest): Promise<{ songs: SongNew[], total: number }>;
    updateStatus(id: string, status: boolean): Promise<SongNew | null>;
    updatePlayCount(songId: string): Promise<void>
}
