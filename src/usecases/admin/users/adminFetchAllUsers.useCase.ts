import { IUserRepository } from "../../../domain/repositories/user.repository";
import { UsersTableResponseDTO } from "../../../application/dto/admin/admin.response.dto";
import { UserMapper } from "../../../application/mappers/admin/user/user.mapper";
import { IFetchAllUsersUseCase } from "../../../application/interfaces/usecase/admin/fetch-all-users-usecase.interface";

export class FetchAllUsersUseCase implements IFetchAllUsersUseCase{
    constructor(
        private readonly _userRepository: IUserRepository
    ){}

    async execute(page: number, limit:number, search: string): Promise<UsersTableResponseDTO>{
        const {data:users, totalCount} = await this._userRepository.findAll(page, limit, search)

        const response = UserMapper.toTableRows(users);
        const totalPages = Math.ceil(totalCount/ limit)

        return {users:response, totalCount, page, limit, totalPages}
    }
}