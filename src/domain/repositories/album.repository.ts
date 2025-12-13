import { ClientSession } from "mongoose"
import { Album } from "../entities/album.entity"

export interface IAlbumRepository{
    create(albumData:Partial<Album>, session: ClientSession): Promise<Album>
    getAll(): Promise<Album[]>
    findById(id: string): Promise<Album | null>
    getAlbumsByIds(albumIds: string[]): Promise<Album[]>
    updateById(albumId: string, data: Partial<Album>, session?: ClientSession): Promise<Album | null>
    find(albumId: string): Promise<Album | null>
    removeSongFromAllAlbums(songId: string, session: ClientSession): Promise<void>
    delete(albumId: string, session: ClientSession): Promise<boolean>
    countDocuments(): Promise<number>
    updateSongTitleInAlbums(songId: string, newTitle: string, session: ClientSession): Promise<void>
    removeSongTitleFromAllAlbums(songTitle: string, session: ClientSession): Promise<void>
}