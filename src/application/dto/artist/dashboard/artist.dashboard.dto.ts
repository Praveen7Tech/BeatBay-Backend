
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

export interface TopPlayedSongDTO {
    songId: string;
    title: string;
    playCount: number;
    coverImageUrl: string;
}

export interface TopPlayedAlbumsDTO{
    albumId: string
    title: string
    playCount: number
    coverImageUrl:string
    songs: number
}

export interface ArtistDashboardResponseDTO{
    totalSongs: number
    totalAlbums:number
    totalFans: number
    totalRevenue: number;
    //topPlayedSongs: TopPlayedSongDTO[]
    topPlayedAlbums: TopPlayedAlbumsDTO[]
}

export interface ArtistGrowthChartDTO {
  label: string;
  fans: number;
  streams: number;
  revenue: number;
  songs: number;
  albums: number
}
