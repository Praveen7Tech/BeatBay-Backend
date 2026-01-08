export interface AdminSongListItemDTO {
    id: string;
    title: string;
    genre: string;
    coverImageUrl: string;
    status: boolean
    duration: number;
    likesCount: number;
    uploadDate: Date; 
}

export interface PaginatedSongResponse {
    songs: AdminSongListItemDTO[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
