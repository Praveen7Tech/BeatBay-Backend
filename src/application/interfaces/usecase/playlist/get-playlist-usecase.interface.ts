import { PlayList } from "../../../../domain/entities/playList.entiy";

export interface IGetPlayListUseCase {
    execute(playListId: string): Promise<PlayList | null>;
}