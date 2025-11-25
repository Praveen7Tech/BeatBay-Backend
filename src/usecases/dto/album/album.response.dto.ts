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
