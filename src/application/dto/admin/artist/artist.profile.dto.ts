export interface Song{
    id: string;
    title: string
    coverImageUrl: string;
    status: boolean;
}
export interface Album{
    id: string;
    title: string;
    coverImageUrl: string; 
    status: boolean;
    createAt: Date
}

export interface ArtistProfileDTO {
  name: string;
  bio: string | null;
  profilePicture: string
  status: boolean;
  email: string;
  joinDate: Date;

  songs: Song[]
  albums: Album[]
}
