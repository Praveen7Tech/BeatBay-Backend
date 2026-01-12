import { Interface } from "readline";

export interface CreateAlbumDTO {
    title: string, 
    description: string, 
    coverImageUrl: string,
    coverImagePublicId: string,
    songs:string[],
}

export interface AlbumListDTO {
    id: string;
    title: string;
    artistName: string;
    coverImageUrl: string;
}

export interface EditAlbumDetailsDTO{
    id: string;
    coverImagePublicId?: string;
}

export interface AlbumSongDetailsDTO {
  id: string;
  title: string;
  coverImageUrl: string;
  audioUrl: string;
  duration: number;
}
