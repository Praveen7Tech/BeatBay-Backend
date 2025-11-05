import { ObjectId } from "mongoose";

export interface Artist {
  _id?: string;
  name: string
  email: string,
  password: string | null
  profilePicture?:string | null
  googleId?:string | null
  bio?: string | null;
  role : 'user' | 'artist';
  albums?: string[]; 
  songs?: string[]; 
  status?:boolean
  createdAt?: Date;
  updatedAt?: Date;
}
