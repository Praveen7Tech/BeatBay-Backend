import { PlayList } from "../../../../domain/entities/playList.entiy";
import { PlayListEditRequestDTO } from "../../../dto/playList/request.dto";

export interface IEditPlayListUseCase {
    execute(playListId: string, data: PlayListEditRequestDTO): Promise<PlayList | null>;
}