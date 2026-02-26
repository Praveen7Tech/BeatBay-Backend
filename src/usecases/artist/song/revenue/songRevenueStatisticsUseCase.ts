import {SongRevenueDashboardResponseDTO,SongRevenueChartItemDTO,SongPayoutHistoryDTO } from "../../../../application/dto/artist/revenue/song.revenue.history.dto";
import { ISongRevenueHistoryUseCase } from "../../../../application/interfaces/usecase/artist/revenue/songRevenueHistory-usecase.interface";
import { ISongRevenueHistoryRepository } from "../../../../domain/repositories/song.revenue.history.repository";

export class GetSongRevenueDashboardUseCase
  implements ISongRevenueHistoryUseCase
{
  constructor(
    private readonly _songRevenueRepository: ISongRevenueHistoryRepository
  ) {}

  async execute(songId: string,year: number): Promise<SongRevenueDashboardResponseDTO> {

    // lifetime revenue
    const lifetimeRevenue = await this._songRevenueRepository.getLifetimeRevenue(songId);

    // last 12 months range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 11);
    startDate.setDate(1);

    // aggregated revenue from last one year
    const revenueData = await this._songRevenueRepository.getLast12MonthsRevenue(songId, startDate,endDate);

    const monthlyChart: SongRevenueChartItemDTO[] = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);

      const month = date.getMonth() + 1;
      const yearValue = date.getFullYear();

      const found = revenueData.find(r => r.month === month && r.year === yearValue);

      monthlyChart.push({
        label: `${date.toLocaleString("default", { month: "short" })} ${yearValue}`,
        revenue: found ? found.total / 100 : 0
      });
    }

    // total of last 12 months
    const thisYearRevenue = monthlyChart.reduce((sum, m) => sum + m.revenue,0);

    // payout history
    const payoutsRaw = await this._songRevenueRepository.getPayoutHistory(songId);

    const payouts: SongPayoutHistoryDTO[] = payoutsRaw.map(p => ({
      payoutId: p.payoutId,
      revenue: p.revenue,
      period: `${p.periodStart.toLocaleString("default", {
        month: "short"
      })} ${p.periodStart.getFullYear()}`
    }));

    return {
      lifetimeRevenue: lifetimeRevenue / 100,
      thisYearRevenue,
      monthlyChart,
      payouts
    };
  }
}