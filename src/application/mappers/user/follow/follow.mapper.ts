import { FollowingResponseDTO } from "../../../dto/follow/following.dto"; 
import { FollowedEntity } from "../../../../domain/interfaces/following";

export class FollowMapper {
    static toFollowingDTO(user: FollowedEntity): FollowingResponseDTO {
        return {
            id: user._id.toString(),
            name: user.name,
            role: user.role,
            profilePicture: user.profilePicture ?? ''
        };
    }

    static toFollowingDTOs(users: FollowedEntity[]): FollowingResponseDTO[] {
        return users.map(this.toFollowingDTO);
    }
}
