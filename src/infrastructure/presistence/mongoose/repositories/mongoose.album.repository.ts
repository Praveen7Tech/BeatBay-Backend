import { ClientSession } from "mongoose";
import { Album } from "../../../../domain/entities/album.entity";
import { IAlbumRepository } from "../../../../domain/repositories/album.repository";
import { AlbumModel } from "../models/album.model";

export class MongooseAlbumRepository implements IAlbumRepository {
    async create(albumData: Album, session: ClientSession): Promise<Album> {
        const album = new AlbumModel(albumData)

        const createdAlbum = await album.save({session})
        return createdAlbum.toObject()
    }

    async getAll(): Promise<Album[]> {
           const songs = await AlbumModel.find()
           return songs
    }

    async findById(id: string): Promise<Album | null> {
        return await AlbumModel.findById(id)
        .populate({
            path:'artistId',
            select: 'name profilePicture',
            model: 'Artist'
        })
        .populate("songs")
        .lean().exec()
    }

    async getAlbumsByIds(albumIds: string[]): Promise<Album[]> {
        return AlbumModel.find({ _id: { $in: albumIds } })
            .populate("songs", "_id");
    }

    async find(albumId: string): Promise<Album | null> {
        return await AlbumModel.findById(albumId)
        .populate("songs")  
        .lean();
    }

    async updateById(albumId: string, data: Partial<Album>, session?: ClientSession): Promise<Album | null> {
        const updatedAlbum = await AlbumModel.findByIdAndUpdate(albumId,
            {$set: data},
            {new: true, session}
        ).lean().exec()

        return updatedAlbum
    }

    async removeSongFromAllAlbums(songId: string, session: ClientSession): Promise<void> {
        await AlbumModel.updateMany(
            {songs: songId},
            {$pull: {songs: songId}},
            {session}
        ).exec()
    }

    async delete(albumId: string, session: ClientSession): Promise<boolean> {
        const album = await AlbumModel.findByIdAndDelete(albumId).session(session)
        return album !== null
    }

    async countDocuments(): Promise<number> {
        return await AlbumModel.countDocuments()
    }

    async updateSongTitleInAlbums(songId: string, newTitle: string, session: ClientSession): Promise<void> {
        await AlbumModel.updateMany(
            {songs: songId},
            {$set: {"songTitles.$": newTitle}},
            {session}
        ).exec()
    }

    async removeSongTitleFromAllAlbums(songTitle: string, session: ClientSession): Promise<void> {
        await AlbumModel.updateMany(
            {songTitles: songTitle},
            {$pull: {songTitles: songTitle}},
            {session}
        ).exec()
    }

    async getAllAlbum(page: number, limit: number, query?: string): Promise<{albums: Album[], total: number}> {
        const skip = (page - 1) * limit;
        
        // Search filter (can be swapped for Atlas Search pipeline later)
        const filter = query ? { title: { $regex: query, $options: 'i' } } : {};

        const [albums, total] = await Promise.all([
            AlbumModel.find(filter).skip(skip).limit(limit).lean().exec(),
            AlbumModel.countDocuments(filter)
        ]);

        return { albums: albums as unknown as Album[], total };
    }
}