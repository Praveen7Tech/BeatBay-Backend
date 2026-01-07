
export interface TrackPreviewDTO {
    id: string;
    title: string;
    coverImageUrl: string;
    isActive: boolean
}

export interface AdminAlbumDetailsDTO {
    id: string;
    title: string;
    artistName: string;
    coverImageUrl: string;
    description: string
    isActive: boolean
    createdAt: Date;
    songs: TrackPreviewDTO[];
}
