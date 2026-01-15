export interface CreatePlayListResponseDTO{
    id: string
    name:string
}

export interface PlayListEditRequestDTO{
    name?: string
    coverImage?: string
    description?:string
}

export interface UserPlaylistDTO{
    id: string
    name: string
    coverImageUrl?: string | null
}

export interface UserPlaylistResponse{
  playlists:UserPlaylistDTO[],
  totalPages: number
}

export interface PlayListSongDTO {
  id: string;
  title: string;
  artistName:string
  coverImageUrl: string;
  audioUrl:string
  duration: number;
}

export interface PlayListResponseDTO {
  id: string;
  name: string;
  coverImageUrl?: string;
  description?: string;
  totalDuration:number
  songs: PlayListSongDTO[];
}
