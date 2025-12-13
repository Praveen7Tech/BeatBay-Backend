import { PaginatedResult } from "../interfaces/paginatedResult.interface";

export interface IBaseRepository<T> {
    create(entity: T ): Promise<T>;
    findById(id: string): Promise<T | null>
    update(id: string, entity: Partial<T>): Promise< T | null>
    findByEmail(email: string): Promise<T | null>
    findAll(page: number, limit: number, search: string ): Promise<PaginatedResult<T>>
    blockById(id: string): Promise<boolean>
    unBlockById(id: string): Promise<boolean>
    countDocuments(): Promise<number>
    find(query: string): Promise<T[] | null>
}