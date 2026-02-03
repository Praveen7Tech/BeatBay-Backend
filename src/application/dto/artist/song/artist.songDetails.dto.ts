export interface ArtistSongDetailsDTO{
    id:string;
    uploadId: string
    title:string
    description:string
    tags: string[];
    genre:string
    coverImageUrl:string;
    audioUrl:string;
    lyricsUrl:string;
    createdAt:Date
}