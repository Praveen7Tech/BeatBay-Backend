import { User } from "../../../../domain/entities/user.entity";
import { FriendsResponse } from "../../../dto/friends/friends.dto";

export class FriendsMapper {
    static toDTO(user: User): FriendsResponse {
        return {
            id: user._id.toString(),
            name: user.name || "Anonymous",
            profilePicture: user.profilePicture || "",
            status: user.status ?? false
        };
    }

    // Helper for lists
    static toDTOList(users: User[]): FriendsResponse[] {
        return users.map(user => this.toDTO(user));
    }
}
