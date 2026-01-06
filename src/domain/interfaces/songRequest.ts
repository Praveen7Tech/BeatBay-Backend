export interface GetAllSongsRequest {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    genre?: string;
    sort?: 'popularity' | 'az' | 'za' | 'newest';
}