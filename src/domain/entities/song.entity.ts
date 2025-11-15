
export interface Song {
     _id: string; 
    title: string;
    description?: string; 
    genre: string;
    audioUrl: string;       
    coverImageUrl: string;  
    lyricsUrl?: string;     
    artistId: string;          
    tags: string;        
    releaseDate?: Date;     
    playCount: number;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
}