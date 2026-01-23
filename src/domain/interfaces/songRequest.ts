export type SortType = 'popularity' | 'az' | 'za' | 'newest';

export interface GetAllSongsRequest {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    genre?: string;
    sort?: SortType
}