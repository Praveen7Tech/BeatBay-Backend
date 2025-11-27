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
