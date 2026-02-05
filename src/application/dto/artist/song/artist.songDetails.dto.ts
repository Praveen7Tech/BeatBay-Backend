export interface ArtistSongDetailsDTO{
    id:string;
    uploadId: string
    title:string
    description:string
    tags: string[];
    genre:string
    duration: number
    coverImageUrl:string;
    audioUrl:string;
    lyricsUrl:string;
    totalPlays: number;
    likes: number
    createdAt:Date
}