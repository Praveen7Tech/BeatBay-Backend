import { FollowerPreview } from "../../../../domain/interfaces/following";
import { Fans } from "../../../dto/artist/dashboard/artist.dashboard.dto";

export class FansListMapper {

    static toFansList(user: FollowerPreview): Fans{
        return{
            id: user.id,
            name: user.name,
            profilePicture: user.profilePicture,
            followerdSince: user.createdAt
        }
    }

    static toFansMapping(users: FollowerPreview[]): Fans[]{
        return users.map(this.toFansList)
    }
}