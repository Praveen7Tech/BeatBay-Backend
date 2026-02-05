import { ArtistDailyAnalytics } from "../entities/artist.daily.analytics.entity";

export type Fields = "fans" | "streams" | "revenue" | "songs" | "albums"

export interface IArtistDailyAnalyticsRepository {
  incrementField(artistId: string, date: string, field: Fields, value: number): Promise<void>;
  // getDailyRange(artistId: string, from: string, to: string): Promise<ArtistDailyAnalytics[]>;
  // getMonthlyRange(artistId: string,from: string,to: string): Promise<ArtistDailyAnalytics[]>;
  getRange(artistId: string, from: string, to: string):Promise<ArtistDailyAnalytics[]>
}
