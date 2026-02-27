import { AdminPayoutPaginationDTO } from "../../../../dto/admin/revenue/revenue-dashboard.dto";

export interface IRevenuePayoutHistoryUseCase{
    execute(page: number, limit: number): Promise<AdminPayoutPaginationDTO>
}