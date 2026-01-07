
export interface GetAllAlbumsRequest {
    page: number;
    limit: number;
    search?: string;
    status?: string; 
    sort?: 'popularity' | 'az' | 'za' | 'newest';
}