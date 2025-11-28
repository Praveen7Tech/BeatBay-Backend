export interface AdminFetchUsersResponseDTO {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  status: boolean;
  joinDate: string;
  followersCount: number;
}

export interface UsersTableResponseDTO{
    users: AdminFetchUsersResponseDTO[]
    totalCount: number
    page: number
    limit: number
    totalPages: number
}

export interface AdminFetchArtistResponseDTO {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  status: boolean;
  joinDate: string;
  followersCount: number;
  songsCount: number
}

export interface ArtistTableResponseDTO{
    artist: AdminFetchArtistResponseDTO[]
    totalCount: number
    page: number
    limit: number
    totalPages: number
}
