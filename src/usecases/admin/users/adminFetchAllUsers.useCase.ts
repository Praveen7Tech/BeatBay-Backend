import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { UsersTableResponseDTO } from "../../dto/admin/admin.response.dto";

export class FetchAllUsersUseCase{
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(page: number, limit:number, search: string): Promise<UsersTableResponseDTO>{
        const {data:users, totalCount} = await this.userRepository.findAll(page, limit, search)

        const response = users.map((user: User)=>({
            id: user._id!,
            name: user.name!,
            email: user.email!,
            profilePicture: user.profilePicture!,
            status: user.status!,
            joinDate: new Date(user.createdAt!).toISOString().split("T")[0],
            followersCount: user.followingCount!
        }))
        const totalPages = Math.ceil(totalCount/ limit)

        return {users:response, totalCount, page, limit, totalPages}
    }
}