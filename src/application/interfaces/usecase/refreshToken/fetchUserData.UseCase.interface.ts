import { FetchUserDTO } from "../../../dto/auth/response.dto";

export interface IFetchUserDataUseCase{
    execute(userId: string): Promise<FetchUserDTO>
}