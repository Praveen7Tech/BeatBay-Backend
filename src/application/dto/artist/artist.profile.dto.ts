
export interface AlbumResponseDTO {
  id: string;
  title: string;
  coverImageUrl: string;
}

export interface SongResponseDTO {
  id: string;
  title: string;
  coverImageUrl: string;
  artistName: string;
}

export interface ArtistDetailsResponseDTO {
  id: string;
  name: string;
  profilePicture: string;
  bio: string;
  albums: AlbumResponseDTO[];
  songs: SongResponseDTO[];
}
