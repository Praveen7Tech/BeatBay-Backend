import { Song } from "../entities/song.entity";

export interface IRecomentationService {
    getRecomentedSongs(songId: string,artistId:string, genre: string, userId?: string): Promise<Song[]>
}