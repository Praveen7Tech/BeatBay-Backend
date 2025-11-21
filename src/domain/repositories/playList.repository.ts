import { PlayList } from "../entities/playList.entiy";

export interface IPlayListRepository {
    create(name:string): Promise<PlayList>
    findById(playListId: string): Promise<PlayList | null>
}