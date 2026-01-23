import { DemographicsResponseDTO } from "../../../application/dto/admin/dashboard/dashboard.dto";
import { IDashBoardDemographicsUseCase } from "../../../application/interfaces/usecase/admin/dashboard/dahsboard-demographics-usecase.interface";
import { getDateRange } from "../../../application/utils/dateRange";
import { Entity, IDashBoardRepository } from "../../../domain/repositories/demographics.repository";


export class DashBoardDemographicsUseCase implements IDashBoardDemographicsUseCase{
    constructor(
        private readonly _dashBoarRepository: IDashBoardRepository
    ){}

    async execute(entity: string, range: string): Promise<DemographicsResponseDTO> {
        
        const startDate = getDateRange(range)

        const data = await this._dashBoarRepository.getDemographics(entity as Entity, startDate)
        
        const total = data.reduce((ac, curr)=> ac + curr.total ,0)
    
        return {
            entity,range,data, totalDocs: total
        }
    }
}