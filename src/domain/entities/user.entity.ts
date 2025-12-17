import { number } from "zod";
import { PlayList } from "./playList.entiy";

export interface User {
  _id: string;
  name?: string;
  email: string;
  password?: string | null;
  profilePicture?: string | null;
  profileImagePublicId?: string | null
  googleId?: string| null;
  role : 'user' | 'admin';
  status: boolean;
  playLists: PlayList[]
  followingArtists?: string[]
  followingUsers: string[]
  followingCount?: number
  followersCount: number
  createdAt?: Date;
  updatedAt?: Date;
}
