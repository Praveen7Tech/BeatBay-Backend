import { AdminRevenueDashboardDTO } from "../../../../dto/admin/revenue/revenue-dashboard.dto";

export interface IRevenueDashBoardStatsUseCase{
    execute(): Promise<AdminRevenueDashboardDTO>
}