import { ClientSession } from "mongoose";
import { PlayList } from "../entities/playList.entiy";

export interface IPlayListRepository {
    create(plalistData:Partial<PlayList>, session?:ClientSession): Promise<PlayList>
    findById(playListId: string): Promise<PlayList | null>
    findByUserId(userId: string): Promise<PlayList | null>
    update(playListId: string, songId: string): Promise<void>
    edit(playListId: string, entity: Partial<PlayList>): Promise<PlayList | null>;
}