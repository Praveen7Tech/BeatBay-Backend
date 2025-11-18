import { Song } from "../entities/song.entity";

export interface IRecomentationService {
    getRecomentedSongs(songId: string,artistId:string, genre: string): Promise<Song[]>
}