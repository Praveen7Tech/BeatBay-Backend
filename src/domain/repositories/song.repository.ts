
import { Song } from "../entities/song.entity";

export interface CreateSongData {
    title: string;
    genre: string;
    audioUrl: string; 
    coverImageUrl: string; 
    description?: string;
    tags?: string;
    album?: string;
    lyrics?: string;
    lyricsUrl?: string;
    releaseDate?: string; 
    artistId: string; 
}

export interface ISongRepository {
    create(songData: CreateSongData): Promise<Song>;
    // findById(id: string): Promise<Song | null>;
    // findByArtistId(artistId: string): Promise<Song[]>;
}
