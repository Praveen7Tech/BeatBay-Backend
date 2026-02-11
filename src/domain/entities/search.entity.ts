import { Album } from "./album.entity";import { Artist } from "./arist.entity";
import { SongNew } from "./song.entity";

export interface SearchResult{
    topResult: SongNew | null;
    songs:SongNew[];
    albums: Album[];
    artists: Artist[];
}
