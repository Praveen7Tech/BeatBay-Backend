import { User } from "../../../domain/entities/user.entity";

export interface EditProfileRequestDTO {
  name?: string;
  password?: string;
  profileImage?: string;
}

export interface EditProfileResponseDTO {
  user: User;
}