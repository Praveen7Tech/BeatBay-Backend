
export interface Artist {
  _id?: string;
  name: string
  email: string,
  password: string | null
  profilePicture?:string | null
  profileImagePublicId?: string
  googleId?:string | null
  bio?: string | null;
  role : 'user' | 'artist';
  albums?: string[]; 
  songs?: string[]; 
  status?:boolean
  followersCount?: number
  createdAt?: Date;
  updatedAt?: Date;
}
