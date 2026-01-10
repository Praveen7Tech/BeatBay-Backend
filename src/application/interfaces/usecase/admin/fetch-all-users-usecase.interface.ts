import { UsersTableResponseDTO } from "../../../dto/admin/admin.response.dto";

export interface IFetchAllUsersUseCase {
    execute(page: number, limit: number, search: string): Promise<UsersTableResponseDTO>;
}