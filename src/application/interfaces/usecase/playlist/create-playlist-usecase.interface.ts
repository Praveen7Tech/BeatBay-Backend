import { CreatePlayListResponseDTO } from "../../../dto/playList/request.dto";

export interface ICreatePlayListUseCase {
    execute(userId: string): Promise<CreatePlayListResponseDTO>;
}