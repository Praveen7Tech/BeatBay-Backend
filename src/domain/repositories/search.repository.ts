import { Song } from "../entities/song.entity";
import { Album } from "../entities/album.entity";
import { Artist } from "../entities/arist.entity";

export interface ISearchRepository {
  searchSongs(query: string, limit: number): Promise<Song[]>;
  searchAlbums(query: string, limit: number): Promise<Album[]>;
  searchArtists(query: string, limit: number): Promise<Artist[]>;
}
