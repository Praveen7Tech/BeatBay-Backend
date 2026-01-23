import { Album } from "./album.entity";import { Artist } from "./arist.entity";
import { Song } from "./song.entity";

export interface SearchResult{
    topResult: Song | null;
    songs:Song[];
    albums: Album[];
    artists: Artist[];
}
