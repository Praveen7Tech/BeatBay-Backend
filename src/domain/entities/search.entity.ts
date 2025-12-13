import { AlbumResult, ArtistResult, SongResult, TopResult, UserResult } from "../interfaces/search.interface";
import { Album } from "./album.entity";
import { Artist } from "./arist.entity";
import { Song } from "./song.entity";
import { User } from "./user.entity";

export interface SearchResult{
    topResult: Song;
    songs:Song[];
    albums: Album[];
    artists: Artist[];
    users: User[];
}
