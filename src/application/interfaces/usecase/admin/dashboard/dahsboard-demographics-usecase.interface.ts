import { DemographicsResponseDTO } from "../../../../dto/admin/dashboard/dashboard.dto";

export interface IDashBoardDemographicsUseCase {
    execute(entity:string, range:string): Promise<DemographicsResponseDTO>
}

//DemographicsResponseDTO