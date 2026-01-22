import { FansResponseDTO } from "../../../../dto/artist/dashboard/artist.dashboard.dto";

export interface IGetAllFansUseCase{
    execute(artistId:string, page:number, limit:number): Promise<FansResponseDTO>
}