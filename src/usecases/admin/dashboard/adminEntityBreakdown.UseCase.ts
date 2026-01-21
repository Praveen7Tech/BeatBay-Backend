import { EntityBreakDownResponse } from "../../../application/dto/admin/dashboard/dashboard.dto";
import { IDashBoardEntityBreakDownUseCase } from "../../../application/interfaces/usecase/admin/dashboard/entity-breakdown-usecase.interface";
import { EntityBreakdownMapper } from "../../../application/mappers/admin/dashboard/dashboard-entity-breakdown.mapper";
import { IDashBoardRepository } from "../../../domain/repositories/demographics.repository";

export class DashBoardEntityBreakDownUseCase implements IDashBoardEntityBreakDownUseCase{
    constructor(
        private readonly _dashBoarRepository: IDashBoardRepository
    ){}

    async execute(): Promise<EntityBreakDownResponse> {
        
        const data = await this._dashBoarRepository.getEntityBreakDown()

        return EntityBreakdownMapper.toDTO(data)
    }
}