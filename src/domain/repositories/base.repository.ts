import { PaginatedResult } from "../interfaces/paginatedResult.interface";

export interface IBaseRepository<T> {
    create(entity: Partial<T> ): Promise<T>;
    findById(id: string): Promise<T | null>
    update(id: string, entity: Partial<T>): Promise< T | null>
    findByEmail(email: string): Promise<T | null>
    findAll(page: number, limit: number, search: string ): Promise<PaginatedResult<T>>
    blockById(id: string): Promise<boolean>
    unBlockById(id: string): Promise<boolean>
    searchByName(query: string): Promise<T[] | null>
}