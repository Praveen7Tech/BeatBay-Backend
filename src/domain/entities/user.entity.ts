export interface User {
  _id?: string;
  name?: string;
  email: string;
  password?: string | null;
  profilePicture?: string | null;
  googleId?: string| null;
  role : 'user' | 'admin';
  status?: boolean;
  followingArtists?: string[]
  followingCount?: number
  createdAt?: Date;
  updatedAt?: Date;
}
