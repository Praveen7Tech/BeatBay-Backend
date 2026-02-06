import { ArtistGrowthChartDTO } from "../../../application/dto/artist/dashboard/artist.dashboard.dto";
import { IArtistGrowthAnalyticsUseCase } from "../../../application/interfaces/usecase/artist/dashboard/artist.growth.analytics-usecase.interface";
import { IArtistDailyAnalyticsRepository } from "../../../domain/repositories/artist.daily.analytics.repository";

export class GetArtistGrowthUseCase implements IArtistGrowthAnalyticsUseCase {
  constructor(
    private readonly _dailyAnalyticsRepository: IArtistDailyAnalyticsRepository,
  ) {}

  async execute(artistId: string, days: number): Promise<ArtistGrowthChartDTO[]> {
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - days);

        const toStr = to.toISOString().split("T")[0];
        const fromStr = from.toISOString().split("T")[0];

        const records = await this._dailyAnalyticsRepository.getRange(artistId,fromStr,toStr );

        // map existing records
        const map = new Map(records.map(r => [r.date, r]));

        const timeline: ArtistGrowthChartDTO[] = [];
        const cursor = new Date(from);

        // full daily timeline
        while (cursor <= to) {
            const dateStr = cursor.toISOString().split("T")[0];
            const existing = map.get(dateStr);

            timeline.push({
            label: dateStr,
            fans: existing?.fans ?? 0,
            streams: existing?.streams ?? 0,
            revenue: existing?.revenue ?? 0,
            songs: existing?.songs ?? 0,
            albums: existing?.albums ?? 0
            });

            cursor.setDate(cursor.getDate() + 1);
        }

        //  yearly convert daily to monthly
        if (days >= 365) {
            const monthly: Record<string, ArtistGrowthChartDTO> = {};

            for (const d of timeline) {
            const month = d.label.slice(0, 7); 

            if (!monthly[month]) {
                monthly[month] = { label: month, fans: 0, streams: 0, revenue: 0, songs: 0, albums : 0 };
            }

            monthly[month].fans += d.fans;
            monthly[month].streams += d.streams;
            monthly[month].revenue += d.revenue;
            monthly[month].songs += d.songs;
            monthly[month].albums += d.albums
            }

            return Object.values(monthly);
        }

        return timeline;
    }

}
