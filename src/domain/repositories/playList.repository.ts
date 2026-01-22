import { ClientSession } from "mongoose";
import { PlayList } from "../entities/playList.entiy";
import { playListProjection, PlayListProjectionResponse } from "../interfaces/playlist.interface";
import { PlayListEditDTO } from "../../application/dto/playList/edit.playlist.dto";
import { DemoGraphics } from "../../application/dto/admin/dashboard/dashboard.dto";

export interface IPlayListRepository {
    create(plalistData:Partial<PlayList>, session?:ClientSession): Promise<PlayList>
    findById(playListId: string): Promise<PlayList | null>
    getDetails(playListId: string): Promise<PlayListEditDTO | null>;
    findByUserId(userId: string,page:number, limit:number): Promise<PlayListProjectionResponse>
    update(playListId: string, songId: string): Promise<boolean>
    edit(playListId: string, entity: Partial<PlayList>): Promise<PlayList | null>;
    removeSongFromAllPlaylists(songId: string, session: ClientSession): Promise<void>
    removeSong(playlistId:string, songId:string): Promise<void>
    delete(playlistId:string): Promise<boolean>
    countDocuments(): Promise<number>
}