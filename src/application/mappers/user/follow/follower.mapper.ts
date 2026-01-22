import { FollowerPreview } from "../../../../domain/interfaces/following";
import { Fans } from "../../../dto/artist/dashboard/artist.dashboard.dto";
import { FollowingResponseDTO } from "../../../dto/follow/following.dto";


export class FollowerMapper {
    static toFollowerDTO(user: FollowerPreview): FollowingResponseDTO {
        return {
            id: user.id,
            name: user.name,
            role: user.role,
            profilePicture: user.profilePicture ?? ''
        };
    }

    static toFollowerDTOs(users: FollowerPreview[]): FollowingResponseDTO[] {
        return users.map(this.toFollowerDTO);
    }
}
