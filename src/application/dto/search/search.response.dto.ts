
export interface SongDTO{
    id: string
    title: string
    artistName: string
    duration: number
    coverImageUrl: string
    audioUrl: string
}

export interface ArtistDTO {
  id: string 
  name: string;
  profilePicture: string; 
}

export interface AlbumDTO {
  id: string;
  title: string;
  artist: string; 
  coverImageUrl: string;
}

export interface TopResultDTO {
  id: string;
  title: string;
  artist: string;
  coverImageUrl: string;
}

export interface SearchResponseDTO{
    topResult: TopResultDTO | null
    albums: AlbumDTO[]
    songs: SongDTO[];
    artists: ArtistDTO[];
    users: ArtistDTO[]
}