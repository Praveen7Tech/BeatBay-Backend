
import { PlayListEditDTO } from "../../../dto/playList/edit.playlist.dto";

export interface IGetPlayListEditUseCase{
    execute(playListId: string): Promise<PlayListEditDTO | null>;
}