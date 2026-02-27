import { AdminRevenueDashBoardChartDTO } from "../../application/dto/admin/revenue/revenue-dashboard.dto";
import { RevenueRange } from "../../application/interfaces/usecase/admin/revenue/revenue-dashboardDetails-usecase.interface";
import { Subscription } from "../entities/subscription.entity";

export interface PlatformRevenueStats {
  totalRevenue: number
  thisMonthRevenue: number
  thisYearRevenue: number
}

export interface ISubscriptionRepository{
    getSubscription(userId: string): Promise<Partial<Subscription> | null>;
    getPlatformRevenueStats(): Promise<PlatformRevenueStats>;
    getRevenueChart(range: RevenueRange): Promise<AdminRevenueDashBoardChartDTO[]>;
}