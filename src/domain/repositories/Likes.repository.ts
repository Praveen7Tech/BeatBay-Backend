import { LikedSongDetails } from "../../application/dto/favorites/favourites.response.dto";

export interface LikedSongsResponseData{
    songs: LikedSongDetails[]
    totalCount: number
}

export interface IMongooseLikesRepository{
    toggleLike(songId:string, userId: string): Promise<boolean>;
    likedSongs(userId: string, page: number): Promise<LikedSongsResponseData>
    isSongLiked(userId: string, songId: string): Promise<boolean>;
    findLikedSongIds(userId:string,songIds:string[]): Promise<Set<string>>
}