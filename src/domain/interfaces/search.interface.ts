
export interface SongResult{
    id: string
    title: string
    artist: string
    duration: string
    image: string
    score: number
    type: "song"
}

export interface ArtistResult {
  id: string;
  name: string;
  image: string; 
  score: number
  type: "artist"
}

export interface AlbumResult {
  id: string;
  title: string;
  artist: string; 
  coverImageUrl: string;
  score: number
  type: "album"
}

export interface TopResult {
  id: string;
  title: string;
  artist: string;
  image: string;
  score: number
  type: string; 
}

export interface UserResult {
  id: string;
  name: string;
  image: string;
  score: number
  type: "user" 
}