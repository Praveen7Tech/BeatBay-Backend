import { AdminRevenueDashboardDTO } from "../../../application/dto/admin/revenue/revenue-dashboard.dto";
import { IRevenueDashBoardStatsUseCase } from "../../../application/interfaces/usecase/admin/revenue/revenue-dashboard-stats-usecase.interface";
import { IPayoutHistoryRepository } from "../../../domain/repositories/payoutHistory.repository";
import { ISongRevenueHistoryRepository } from "../../../domain/repositories/song.revenue.history.repository";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";

export class RevenueDashboardStatisticsUseCase implements IRevenueDashBoardStatsUseCase {
  constructor(
    private readonly _payoutHistoryRepository: IPayoutHistoryRepository,
    private readonly _songRevenueRepository: ISongRevenueHistoryRepository,
    private readonly _subscriptionRepository: ISubscriptionRepository
  ) {}

  private getNextPayoutDate(): Date {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();

    const firstOfThisMonth = new Date(year, month, 1);

    if (now < firstOfThisMonth) {
      return firstOfThisMonth;
    }

    return new Date(year, month + 1, 1);
  }

  async execute(): Promise<AdminRevenueDashboardDTO> {
    const revenueStats = await this._subscriptionRepository.getPlatformRevenueStats();

    const topArtists = await this._payoutHistoryRepository.getTopArtistsByRevenue();

    const topSongs = await this._songRevenueRepository.getTopSongsByRevenue();

    const nextPayoutDate = this.getNextPayoutDate();

    return {
      stats: {
        ...revenueStats,
        nextPayoutDate,
      },
      topArtists,
      topSongs,
    };
  }
}