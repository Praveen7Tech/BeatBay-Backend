
import { SongRevenueDashboardResponseDTO, SongRevenueChartItemDTO, SongPayoutHistoryDTO } from "../../../../application/dto/artist/revenue/song.revenue.history.dto";
import { ISongRevenueHistoryUseCase } from "../../../../application/interfaces/usecase/artist/revenue/songRevenueHistory-usecase.interface";
import { ISongRevenueHistoryRepository } from "../../../../domain/repositories/song.revenue.history.repository";

export class GetSongRevenueDashboardUseCase implements ISongRevenueHistoryUseCase {
  constructor(
    private readonly _songRevenueRepository: ISongRevenueHistoryRepository
  ) {}

  async execute(songId: string, year: number): Promise<SongRevenueDashboardResponseDTO> {

    // Lifetime revenue in dollars
    const lifetimeRevenue = await this._songRevenueRepository.getLifetimeRevenue(songId) ;

    // Yearly revenue aggregated by month
    const yearlyData = await this._songRevenueRepository.getYearlyRevenue(songId, year);

    const monthMap = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const yearlyChart: SongRevenueChartItemDTO[] = monthMap.map((monthLabel, index) => {
      const monthData = yearlyData.find(y => y.month === index + 1);
      return {
        label: monthLabel,
        revenue: monthData ? monthData.total / 100 : 0
      };
    });

    const thisYearRevenue = yearlyChart.reduce((sum, y) => sum + y.revenue, 0);

    // Payout history
    const payoutsRaw = await this._songRevenueRepository.getPayoutHistory(songId);
    const payouts: SongPayoutHistoryDTO[] = payoutsRaw.map(p => ({
      payoutId: p.payoutId,
      revenue: p.revenue,
      period: `${monthMap[p.periodStart.getMonth()]} ${p.periodStart.getFullYear()}`
    }));

    return {
      lifetimeRevenue:lifetimeRevenue / 100,
      thisYearRevenue,
      monthlyChart: yearlyChart,
      payouts
    };
  }
}
