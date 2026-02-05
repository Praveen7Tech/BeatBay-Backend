export interface SongRevenueHistory {
  artistId: string;
  songId: string;
  payoutId: string;
  periodStart: Date;
  periodEnd: Date;
  playCount: number;
  revenueAmount: number;
}