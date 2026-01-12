import { Song } from "../../../domain/entities/song.entity";

export type SongHydrationResponseDTO = Song[];


export interface FetchSongItemDTO {
  id: string;
  title: string;
  coverImageUrl: string;
  duration: number;
  createdAt: string;
}

export interface FetchSongsResponseDTO {
  songs: FetchSongItemDTO[];
}

export interface ArtistDTO {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface SongDetailsDTO {
  id: string;
  title: string;
  coverImageUrl: string;
  audioUrl: string;
  lyricsUrl?: string;
  duration: number;
  isLiked?: boolean;
  artist: ArtistDTO;
}

export interface SongDetailsResponseDTO {
  song: SongDetailsDTO;
  recommendations: SongDetailsDTO[];
}


export interface HydratedArtistDTO {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface HydratedSongDTO {
  id: string;
  title: string;
  coverImageUrl: string;
  audioUrl: string;
  lyricsUrl?: string;
  duration: number;
  artist: HydratedArtistDTO;
}

// export type SongHydrationResponseDTO = HydratedSongDTO[];


