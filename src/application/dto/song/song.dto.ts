
// export interface UploadSongDTO {
//     title: string;
//     description: string;
//     genre: string,
//     tags: string[], 
//     songFilePath: string;
//     audioPublicId: string; 
//     coverImagePath: string;
//     coverImagePublicId: string; 
//     lrcFilePath: string;
//     lyricsPublicId: string; 
//     duration: number;
// }
export interface UploadSongDTO {
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
    songFilePath?: string;
    audioPublicId?: string;
    coverImagePath?: string;
    coverImagePublicId?: string;
    lrcFilePath?: string;
    lyricsPublicId?: string;
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
