export interface TopArtistDTO {
  rank: number;
  artistId: string;
  name: string;
  profilePicture: string | null;
  revenue: number;       // in USD
  streams: number;       // total streams
}

export interface TopSongDTO {
  rank: number;
  songId: string;
  title: string;
  image: string; // coverImageKey
  streams: number;
  revenue: number;
}

export interface AdminRevenueDashboardDTO {
  stats: {
    totalRevenue: number
    thisMonthRevenue: number
    thisYearRevenue: number
    nextPayoutDate: Date
  }
  topArtists: TopArtistDTO[]
  topSongs: TopSongDTO[]
}

export interface AdminRevenueDashBoardChartDTO{
  label: string;
  revenue: number
}

export interface AdminPayoutHistoryDTO {
  id: string;
  date: string;
  artist: string;
  amount: number;
  status: "completed" | "failed";
  method: string;
}

export interface AdminPayoutPaginationDTO {
  items: AdminPayoutHistoryDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}