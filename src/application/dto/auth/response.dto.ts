
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

export interface RoomState{
  roomId: string,
  hostId: string,
  guestId: string,
  status: "pending" | "jamming"
}

export interface LoginResponseDTO {
  user: AuthUserDTO | AuthArtistDTO; 
  accessToken: string;
  refreshToken: string;
  roomState?: RoomState | null
}

