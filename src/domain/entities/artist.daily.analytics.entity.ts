
export interface ArtistDailyAnalytics {
  _id: string;
  artistId: string;
  date: string;

  fans: number;
  streams: number;
  revenue: number;
  songs: number;
  albums: number;

  createdAt: Date;
  updatedAt: Date;
}
