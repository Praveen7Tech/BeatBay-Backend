
import { AlbumSongDetailsDTO } from "./album.dto";

export interface AlbumResponseDTO {
    id: string;
    name: string;
    coverImageUrl: string;
    totalSongs: number;
    createdAt: Date;
  }


export interface ArtistAlbumsResponseDTO {
  artistId: string;
  totalAlbums: number;
  totalSongs: number;   
  albums: AlbumResponseDTO[];
}

export interface AlbumDetailsDTO{
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  songs: { id: string; title: string; coverImageUrl: string }[];
}

export interface FetchAlbumItemDTO {
  id: string;
  title: string;
  coverImageUrl: string;
}

export interface FetchAlbumsResponseDTO {
  albums: FetchAlbumItemDTO[];
}


export interface AlbumDetailsResponseDTO {
  id: string;
  title: string;
  description?: string;
  coverImageUrl: string;
  artistName: string;
  releaseYear: Date;
  songs: AlbumSongDetailsDTO[];
}

