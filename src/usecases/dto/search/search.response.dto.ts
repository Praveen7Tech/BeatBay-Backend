import { Interface } from "readline"

export interface SongDTO{
    id: string
    title: string
    artist: string
    duration: string
    image: string
}

export interface ArtistDTO {
  id: string;
  name: string;
  image: string; 
}

export interface AlbumDTO {
  id: string;
  title: string;
  artist: string; 
  coverImageUrl: string;
  type: 'album';
}

export interface TopResultDTO {
  id: string;
  title: string;
  type: string; 
  artist: string;
  image: string;
}

export interface SearchResponseDTO{
    topResult: TopResultDTO
    song: SongDTO[];
    artists: ArtistDTO[];
    albums: AlbumDTO[]
    
}