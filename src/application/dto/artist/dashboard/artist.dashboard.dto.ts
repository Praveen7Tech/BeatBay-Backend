
export interface Fans{
    id:string
    name:string
    profilePicture:string
    followerdSince: string
}

export interface FansResponseDTO{
    fans: Fans[]
    totalCount: number
    totalPages: number
}

export interface ArtistDashboardResponseDTO{
    totalSongs: number
    totalAlbums:number
    totalFans: number
}