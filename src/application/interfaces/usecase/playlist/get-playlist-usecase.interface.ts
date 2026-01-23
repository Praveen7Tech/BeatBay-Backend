import { PlayListResponseDTO } from "../../../dto/playList/request.dto";

export interface IGetPlayListUseCase {
    execute(playListId: string): Promise<PlayListResponseDTO | null>;
}