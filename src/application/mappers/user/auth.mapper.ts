import { Artist } from "../../../domain/entities/arist.entity";
import { User } from "../../../domain/entities/user.entity";
import { AuthArtistDTO, AuthUserDTO } from "../../dto/auth/response.dto";

export class AuthMapper {
    static toAuthUserDTO(user: User): AuthUserDTO{
        return{
            id: user._id,
            name: user.name || "",
            email: user.email,
            profilePicture: user.profilePicture || "",
            followingCount: user.followingCount || 0,
            role: user.role
        }
    }

    static toAuthArtistDTO(user: Artist): AuthArtistDTO{
        return{
            id: user._id,
            name: user.name || "",
            email: user.email,
            profilePicture: user.profilePicture || "",
            followersCount: user.followersCount || 0,
            role: user.role
        }
    }
}