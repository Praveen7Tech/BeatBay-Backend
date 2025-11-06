import { ClientSession } from "mongoose";
import { User } from "../entities/user.entity";

export interface IBaseRepository<T> {
    create(entity: T ): Promise<T>;
    findById(id: string): Promise<T | null>
    update(id: string, entity: Partial<T>): Promise< T | null>
    findByEmail(email: string): Promise<T | null>
}