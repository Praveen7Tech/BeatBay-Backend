import { EntityBreakDownResponse } from "../../../../dto/admin/dashboard/dashboard.dto";

export interface IDashBoardEntityBreakDownUseCase{
    execute(): Promise<EntityBreakDownResponse>
}