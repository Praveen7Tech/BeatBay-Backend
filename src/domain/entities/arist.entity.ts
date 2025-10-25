import { ObjectId } from "mongoose";

export interface Artist {
  _id?: string;
  userId: string; 
  bio?: string;
  albums?: string[]; 
  songs?: string[]; 
  createdAt?: Date;
  updatedAt?: Date;
}
