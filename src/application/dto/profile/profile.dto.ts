

export interface EditProfileRequestDTO {
  name?: string;
  bio?:string
  password?: string;
  profileImage?: string;
  profileImagePublicId?:string
}

export interface ChangePasswordRequestDTO{
  currentPassword : string
  newPassword: string
}

export interface FollowDTO{
  id:string
  name:string
  profilePicture:string
}

export interface PlayListDTO{
  id:string
  title:string
  coverImageUrl:string
}
export interface UserDTO{
  id:string
  name:string
  profilePicture:string
  followingCount: number
  palyListCount:number
}

export interface UserProfileRespnseDTO{
  user: UserDTO,
  followingArtists: FollowDTO[]
  playlists: PlayListDTO[]

}

export interface UserProfileDTO {
  id: string;
  name: string;
  profilePicture: string;
  followingCount: number;
  playListCount: number;
}

export interface UserProfileResponseDTO {
  user: UserProfileDTO;
  followingArtists: FollowDTO[];
  followingUsers: FollowDTO[]
  playlists: PlayListDTO[];
  followers: FollowDTO[]
}
