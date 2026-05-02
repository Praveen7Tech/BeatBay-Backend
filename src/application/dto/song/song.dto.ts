import { SongNew } from "../../../domain/entities/song.entity";


export interface UploadSongDTO {
    uploadId: string
    title: string;
    description: string;
    genre: string,
    tags: string[], 
    trackKey: string;
    coverKey: string; 
    lyricsKey: string;
    duration: number;
}

export interface EditSongDTO {
    title?: string;
    description?: string;
    genre?: string;
    tags?: string[];  
    trackKey?: string;
    coverKey?: string; 
    lyricsKey?: string;
    duration?: number;
}

export interface SongListDTO {
    id: string;
    title: string;
    coverImageUrl: string;
    artistName: string;
    duration: number;
}

export interface PaginatedResponseDTO<T> {
    docs: T[];
    totalPages: number;
    currentPage: number;
    totalDocs: number;
}

export interface SearchSongsDTO {
  query: string;
  limit?: number;
  offset?: number;
}

export interface SongResponseDTO {
  id: string;
  title: string;
  coverImageUrl: string;
  artistName: string;
  duration: number;
  audioUrl: string;
}

export interface PreparedSong {
  song: SongNew;
  coverImageUrl: string;
  audioUrl: string;
};

export interface PreparedTopResult {
  song: SongNew;
  coverImageUrl: string;
};

export type PreparedAdminSong = SongNew & {
  coverImageUrl: string;
};

