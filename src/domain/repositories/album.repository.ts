import { ClientSession } from "mongoose"
import { Album } from "../entities/album.entity"
import { GetAllAlbumsRequest } from "../interfaces/albumRequest"
import { EditAlbumDetailsDTO } from "../../application/dto/album/album.dto"
import { DemoGraphics } from "../../application/dto/admin/dashboard/dashboard.dto"

export interface IAlbumRepository{
    create(albumData:Partial<Album>, session: ClientSession): Promise<Album>
    getAll(): Promise<Album[]>
    findById(id: string): Promise<Album | null>
    getDetails(albumId: string): Promise<EditAlbumDetailsDTO | null>;
    getAlbumsByIds(albumIds: string[]): Promise<Album[]>
    updateById(albumId: string, data: Partial<Album>, session?: ClientSession): Promise<Album | null>
    find(albumId: string): Promise<Album | null>
    removeSongFromAllAlbums(songId: string, session: ClientSession): Promise<void>
    delete(albumId: string, session: ClientSession): Promise<boolean>
    countDocuments(): Promise<number>
    updateSongTitleInAlbums(songId: string, newTitle: string, session: ClientSession): Promise<void>
    removeSongTitleFromAllAlbums(songTitle: string, session: ClientSession): Promise<void>

    getAllAlbum(page: number, limit: number, query?: string): Promise<{albums: Album[], total: number}>
    admingetAllAlbums(params: GetAllAlbumsRequest): Promise<{ albums: any[], total: number }>;
    adminFindById(id: string): Promise<Album | null>
    updateStatus(id: string, status: boolean): Promise<Album | null>
    //getAlbumStatistics(startDate: Date): Promise<DemoGraphics>
}