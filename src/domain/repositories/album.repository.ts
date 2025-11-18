import { Album } from "../entities/album.entity"

export interface IAlbumRepository{
    create(albumData:Partial<Album>): Promise<Album>
    getAll(): Promise<Album[]>
    findById(id: string): Promise<Album | null>
}