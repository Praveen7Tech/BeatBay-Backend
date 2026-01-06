import { User } from "../../../../domain/entities/user.entity";


export class UserMapper {
    static toTableRow(user: User) {
        return {
            id: user._id!,
            name: user.name!,
            email: user.email!,
            profilePicture: user.profilePicture!,
            status: user.status!,
            joinDate: new Date(user.createdAt!)
                .toISOString()
                .split("T")[0],
            followersCount: user.followingCount ?? 0
        };
    }

    static toTableRows(users: User[]) {
        return users.map(this.toTableRow);
    }
}
