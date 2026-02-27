import { AdminRevenueDashBoardChartDTO } from "../../../application/dto/admin/revenue/revenue-dashboard.dto";
import { IRevenueDashBoardChartUseCase, RevenueRange } from "../../../application/interfaces/usecase/admin/revenue/revenue-dashboardDetails-usecase.interface";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";

export class RevenueDashboardChartUseCase
  implements IRevenueDashBoardChartUseCase
{
  constructor(
    private readonly _subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(range: RevenueRange): Promise<AdminRevenueDashBoardChartDTO[]> {
    return this._subscriptionRepository.getRevenueChart(range);
  }
}