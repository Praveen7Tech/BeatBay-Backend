export interface Song{
    id: string;
    title: string
    coverImageUrl: string;
    status: boolean;
    duration: number
}
export interface Album{
    id: string;
    title: string;
    coverImageUrl: string; 
    status: boolean;
    createdAt: Date;
    songsCount : number
}

export interface ArtistProfileDTO {
  name: string;
  bio: string | null;
  profilePicture: string
  status: boolean;
  email: string;
  joinDate: Date;
  followersCount: number

  songs: Song[]
  albums: Album[]
}
