export interface ArtistDetails {
    _id: string;
    name: string;
    profilePicture: string;
}

export interface Song {
    _id: string;
    title: string;
    description: string;  
    genre: string;
    audioUrl: string;
    audioPublicId: string;
    coverImageUrl: string;
    coverImagePublicId: string;
    lyricsUrl: string;
    lyricsPublicId: string;
    artistId: string | ArtistDetails;
    artistName: string;
    tags: string[];
    duration: number;
    playCount: number;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
}
