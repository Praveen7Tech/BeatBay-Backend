
export interface AdminAlbumListItemDTO {
    id: string;
    title: string;
    artistName: string;
    coverImageUrl: string;
    trackCount: number;
    isActive: boolean;
    createdAt: Date;
}

export interface PaginatedAlbumResponse {
    albums: AdminAlbumListItemDTO[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

export interface Song {
    _id: string;
    title: string;
    duration: number;
    audioUrl: string;
    coverImageUrl: string;
    likesCount: number;
}


