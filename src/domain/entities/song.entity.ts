
export interface ArtistDetails {
    _id: string
    name: string
    profilePicture: string
}

export interface Song {
     _id: string; 
    title: string;
    description?: string; 
    genre: string;
    audioUrl: string;       
    coverImageUrl: string;  
    lyricsUrl?: string;     
    artistId: string | ArtistDetails          
    tags: string;        
    releaseDate?: Date;  
    duration: string   
    playCount: number;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
}