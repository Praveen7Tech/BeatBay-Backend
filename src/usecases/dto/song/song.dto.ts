
export interface UploadSongDTO {
    title: string;
    description: string;
    genre: string,
    tags: string, 
    songFilePath: string;
    audioPublicId: string; 
    coverImagePath: string;
    coverImagePublicId: string; 
    lrcFilePath: string;
    lyricsPublicId: string; 
    duration: number;
}