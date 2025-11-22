import { PlayList } from "./playList.entiy";

export interface User {
  _id?: string;
  name?: string;
  email: string;
  password?: string | null;
  profilePicture?: string | null;
  googleId?: string| null;
  role : 'user' | 'admin';
  status?: boolean;
  playLists: PlayList[]
  followingArtists?: string[]
  followingCount?: number
  createdAt?: Date;
  updatedAt?: Date;
}
