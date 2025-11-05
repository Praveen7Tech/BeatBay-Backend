import { ClientSession } from "mongoose";
import { User } from "../entities/user.entity";

export interface IBaseRepository<T> {
    create(entity: T, session?: ClientSession): Promise<T>;
    findById(id: string): Promise<T | null>
    findAll(): Promise<T[]>
    update(id: string, entity: Partial<T>, session?: ClientSession): Promise< T | null>
    delete(id: string): Promise<boolean>
    findByEmail(email: string): Promise<User | null>
}