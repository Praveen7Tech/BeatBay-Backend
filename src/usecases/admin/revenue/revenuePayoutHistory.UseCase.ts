import { AdminPayoutPaginationDTO } from "../../../application/dto/admin/revenue/revenue-dashboard.dto";
import { IRevenuePayoutHistoryUseCase } from "../../../application/interfaces/usecase/admin/revenue/revenue-payout-history-usecase.interface";
import { IPayoutHistoryRepository } from "../../../domain/repositories/payoutHistory.repository";

export class RevenuePayoutHistoryUseCase implements IRevenuePayoutHistoryUseCase{
    constructor(
        private readonly _payoutHistoryRepository: IPayoutHistoryRepository
    ){}

    execute(page: number, limit: number): Promise<AdminPayoutPaginationDTO> {
        return this._payoutHistoryRepository.getPayoutHistory(page, limit)
    }
}