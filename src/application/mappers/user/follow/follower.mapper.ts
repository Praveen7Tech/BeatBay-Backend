import { FollowedEntity } from "../../../../domain/interfaces/following";
import { FollowingResponseDTO } from "../../../dto/follow/following.dto";


export class FollowerMapper {
    static toFollowerDTO(user: FollowedEntity): FollowingResponseDTO {
        return {
            id: user._id,
            name: user.name,
            role: user.role,
            profilePicture: user.profilePicture ?? ''
        };
    }

    static toFollowerDTOs(users: FollowedEntity[]): FollowingResponseDTO[] {
        return users.map(this.toFollowerDTO);
    }
}
