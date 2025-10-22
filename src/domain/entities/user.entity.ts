export interface User {
  _id?: string;
  name?: string;
  email: string;
  password?: string | null;
  profilePicture?: string | null;
  googleId?: string| null;
  role : 'user' | 'admin' | 'artist';
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
