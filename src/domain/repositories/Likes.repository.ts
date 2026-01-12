import { LikedSongDetails } from "../../application/dto/favorites/favourites.response.dto";
import { Song } from "../entities/song.entity";

export interface LikedSongsResponseData{
    songs: LikedSongDetails[]
    totalCount: number
}

export interface IMongooseLikesRepository{
    toggleLike(songId:string, userId: string): Promise<boolean>;
    likedSongs(userId: string, page: number): Promise<LikedSongsResponseData>
}