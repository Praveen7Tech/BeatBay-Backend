export type SortType = 'popularity' | 'az' | 'za' | 'newest';

export interface GetAllAlbumsRequest {
    page: number;
    limit: number;
    search?: string;
    status?: string; 
    sort?: SortType
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
  coverImageKey: string;
  coverImageUrl?: string;
  artistName: string;
  duration: string
  status: boolean;
}

export interface ArtistPopulated {
  _id: string;
  name: string;
  profilePicture: string | null;
  bio: string | null;
  followersCount: number
  albums?: AlbumPopulated[];
  songs?: SongPopulated[];
}
