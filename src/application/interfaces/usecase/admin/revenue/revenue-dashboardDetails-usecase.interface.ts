import { AdminRevenueDashBoardChartDTO } from "../../../../dto/admin/revenue/revenue-dashboard.dto";

export type RevenueRange = "weekly" | "monthly" | "yearly"

export interface IRevenueDashBoardChartUseCase{
    execute(range: RevenueRange): Promise<AdminRevenueDashBoardChartDTO[]>
}