import { Artist } from "../../../domain/entities/arist.entity";
import { User } from "../../../domain/entities/user.entity";

export interface EditProfileRequestDTO {
  name?: string;
  bio?:string
  password?: string;
  profileImage?: string;
}

export interface EditProfileResponseDTO {
  user: User | Artist;
}