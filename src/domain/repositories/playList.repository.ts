import { ClientSession } from "mongoose";
import { PlayList } from "../entities/playList.entiy";
import { playListProjection } from "../interfaces/playlist.interface";

export interface IPlayListRepository {
    create(plalistData:Partial<PlayList>, session?:ClientSession): Promise<PlayList>
    findById(playListId: string): Promise<PlayList | null>
    findByUserId(userId: string): Promise<playListProjection[]>
    update(playListId: string, songId: string): Promise<void>
    edit(playListId: string, entity: Partial<PlayList>): Promise<PlayList | null>;
    removeSongFromAllPlaylists(songId: string, session: ClientSession): Promise<void>
}