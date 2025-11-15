import { Album } from "../../../../domain/entities/album.entity";
import { IAlbumRepository } from "../../../../domain/repositories/album.repository";
import { AlbumModel } from "../models/album.model";

export class MongooseAlbumRepository implements IAlbumRepository {
    async create(albumData: Album): Promise<Album> {
        const album = new AlbumModel(albumData)

        const createdAlbum = await album.save()
        return createdAlbum.toObject()
    }

    async getAll(): Promise<Album[]> {
           const songs = await AlbumModel.find()
           return songs
    }
}