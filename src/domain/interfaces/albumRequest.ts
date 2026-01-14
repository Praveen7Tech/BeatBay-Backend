
export interface GetAllAlbumsRequest {
    page: number;
    limit: number;
    search?: string;
    status?: string; 
    sort?: 'popularity' | 'az' | 'za' | 'newest';
}

export interface AlbumPopulated {
  _id: string;
  title: string;
  coverImageUrl: string;
  isActive: boolean;
}

export interface SongPopulated {
  _id: string;
  title: string;
  coverImageUrl: string;
  artistName: string;
  duration: string
  status: boolean;
}

export interface ArtistPopulated {
  _id: string;
  name: string;
  profilePicture: string | null;
  bio: string | null;
  albums?: AlbumPopulated[];
  songs?: SongPopulated[];
}
