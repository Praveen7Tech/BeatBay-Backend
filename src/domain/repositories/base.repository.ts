import { ClientSession } from "mongoose";

export interface IBaseRepository<T> {
    create(entity: T, session?: ClientSession): Promise<T>;
    findById(id: string): Promise<T | null>
    findAll(): Promise<T[]>
    update(id: string, entity: Partial<T>): Promise< T | null>
    delete(id: string): Promise<boolean>
}