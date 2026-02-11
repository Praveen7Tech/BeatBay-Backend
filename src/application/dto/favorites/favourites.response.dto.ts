import { SongNew } from "../../../domain/entities/song.entity";

export interface LikedSongs {
  id: string;
  title: string;
  coverImageUrl: string;
  audioUrl: string
  duration: number;
  artistName: string;
  likedAt: string; 
}

export interface LikedSongsResponseDTO {
  songs: LikedSongs[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LikedSongDetails {
  _id: string;         
  createdAt: Date;      
  songDetails: SongNew;    
}

export interface PreparedLikedSong {
  raw: LikedSongDetails;
  coverImageUrl: string;
  audioUrl: string;
};