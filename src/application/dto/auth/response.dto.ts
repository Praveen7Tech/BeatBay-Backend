
export interface SignupResponseDTO {
  otp: string;
}

export interface ResendOtpResponseDTO {
  otp: string;
}

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  followingCount: number;
  role: string;
}

export interface AuthArtistDTO {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  followersCount: number;
  role: string;
}

export interface RoomMember{
    id:string
    name:string
    image: string
    role: "host" | "guest"
}

export interface RoomData{
    roomId: string
    hostId: string
    status: "pending" | "jamming"
    members: RoomMember[]
}

export interface LoginResponseDTO {
  user: AuthUserDTO | AuthArtistDTO; 
  accessToken: string;
  refreshToken: string;
  roomState?: RoomData | null
}

