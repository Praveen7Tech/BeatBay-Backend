import { ClientSession } from "mongoose"
import { Album, AlbumWithSongs } from "../entities/album.entity"
import { GetAllAlbumsRequest } from "../interfaces/albumRequest"
import { EditAlbumDetailsDTO } from "../../application/dto/album/album.dto"

export interface PaginaterAlbumResult{
    albums: Album[];
    total: number
}

export interface IAlbumRepository{
    create(albumData:Partial<Album>, session: ClientSession): Promise<Album>
    getAll(): Promise<Album[]>
    findById(id: string): Promise<AlbumWithSongs | null>
    getDetails(albumId: string): Promise<EditAlbumDetailsDTO | null>;
    getAlbumsByIds(albumIds: string[]): Promise<Album[]>
    updateById(albumId: string, data: Partial<Album>, session?: ClientSession): Promise<Album | null>
    find(albumId: string): Promise<Album | null>
    removeSongFromAllAlbums(songId: string, session: ClientSession): Promise<void>
    delete(albumId: string, session: ClientSession): Promise<boolean>
    updateSongTitleInAlbums(songId: string, newTitle: string, session: ClientSession): Promise<void>
    removeSongTitleFromAllAlbums(songTitle: string, session: ClientSession): Promise<void>

    getAllAlbum(page: number, limit: number, query?: string): Promise<PaginaterAlbumResult>
    admingetAllAlbums(params: GetAllAlbumsRequest): Promise<PaginaterAlbumResult>;
    adminFindById(id: string): Promise<AlbumWithSongs | null>
    updateStatus(id: string, status: boolean): Promise<Album | null>
}