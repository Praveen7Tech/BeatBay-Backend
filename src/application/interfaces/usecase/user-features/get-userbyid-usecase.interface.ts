import { User } from "../../../../domain/entities/user.entity";


export interface IGetUserByIdUseCase {
    execute(userId: string): Promise<User | null>;
}